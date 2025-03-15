import { animated, useSprings } from "@react-spring/web";
import { Handler, useGesture } from "@use-gesture/react";
import { useRef, useState } from "react";
import { getScore, getTransform, getBoundedX, getX } from "./util";
import { Cover } from "./cover";

const CLICK_AREA = 100;

export const Coverflow = ({
  covers: coverData,
  size,
  backgroundColor,
}: {
  covers: Parameters<typeof Cover>[0]["meta"][];
  size: string;
  backgroundColor: string;
}) => {
  const clickPosition = useRef<null | { x: number; y: number }>(null);
  const memo = useRef<{ baseScore: number; current: number }>({
    baseScore: 0,
    current: 0,
  });

  const [current, setCurrnet] = useState(0);
  const [baseX, setBaseX] = useState(0);

  const [covers, coversApi] = useSprings(coverData.length, (index) => {
    const score = getScore(baseX) + index;
    return getTransform(score);
  });

  const handler: Handler<"drag" | "wheel"> = ({ movement: [x], active }) => {
    if (active) {
      return coversApi.start((index) => {
        if (index === 0) {
          const boundedX = getBoundedX(baseX, x, covers.length);
          const baseScore = getScore(boundedX);
          memo.current.baseScore = baseScore;
        }

        if (Math.abs(memo.current.baseScore + index) <= 0.5) {
          setCurrnet(index);
          memo.current.current = index;
        }

        return getTransform(memo.current.baseScore + index);
      });
    }

    const current = memo.current.current;
    setCurrnet(current);
    setBaseX(-getX(current));
    return coversApi.start((index) => {
      return getTransform(index - current);
    });
  };

  const bind = useGesture({
    onDrag: handler,
    onWheel: handler,
  });

  return (
    <div
      style={{
        padding: `20px calc(50% - ${size}/2) 400px calc(50% - ${size}/2)`,
        overflow: "hidden",
      }}
    >
      <div
        {...bind()}
        style={{
          touchAction: "none",
          position: "relative",

          height: size,

          perspective: "600px",
          perspectiveOrigin: `calc(0% + ${size}/2) 50%`,
        }}
      >
        {covers.map((props, index) => (
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          <animated.div
            key={index}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              zIndex: covers.length - Math.abs(current - index),
              ...props,
            }}
          >
            <Cover
              meta={coverData[index]}
              backgroundColor={backgroundColor}
              size={size}
              onMouseDown={(e) => {
                const { x, y } = e.currentTarget.getBoundingClientRect();
                clickPosition.current = { x, y };
              }}
              onMouseUp={(e) => {
                const { x, y } = e.currentTarget.getBoundingClientRect();
                if (clickPosition.current === null) return;
                if (
                  (clickPosition.current.x - x) ** 2 +
                    (clickPosition.current.y - y) ** 2 <
                  CLICK_AREA
                ) {
                  const current = index;
                  setCurrnet(index);
                  setBaseX(-getX(current));
                  coversApi.start((index) => {
                    return getTransform(index - current);
                  });
                }
                clickPosition.current = null;
              }}
            />
          </animated.div>
        ))}
      </div>
    </div>
  );
};
