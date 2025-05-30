import { animated, useSprings } from "@react-spring/web";
import { Handler, useGesture } from "@use-gesture/react";
import { useMemo, useRef, useState } from "react";
import { Cover } from "./cover";
import { Util } from "./util";

const CLICK_AREA = 100;

export const Coverflow = ({
  covers: coverData,
  size,
  backgroundColor,
  onChange,
  onSelected,
}: {
  covers: Parameters<typeof Cover>[0]["meta"][];
  size: number;
  backgroundColor: string;
  onChange?: (index: number) => void;
  onSelected?: (index: number) => void;
}) => {
  const clickPosition = useRef<null | { x: number; y: number }>(null);
  const memo = useRef<{ current: number; prevCurrent: number }>({
    current: 0,
    prevCurrent: 0,
  });

  const util = useMemo(() => new Util(size), [size]);

  const [current, setCurrnet] = useState(0);

  const [covers, coversApi] = useSprings(coverData.length, (score) => {
    return util.getTransform(score);
  });

  const setCurrentCover = (current: number) => {
    setCurrnet(current);
    onChange?.(current);
    onSelected?.(current);
    memo.current.prevCurrent = current;
    return coversApi.start((index) => {
      return util.getTransform(index - current);
    });
  };

  const handler: Handler<"drag" | "wheel"> = ({
    movement: [movementX],
    active,
  }) => {
    if (active) {
      const { prevCurrent } = memo.current;

      const diffScore = util.getDiffScore(
        movementX,
        prevCurrent,
        covers.length
      );

      return coversApi.start((index) => {
        const score = index - prevCurrent + diffScore;
        if (Math.abs(score) <= 0.5) {
          setCurrnet(index);
          memo.current.current = index;
          onChange?.(index);
        }
        return util.getTransform(score);
      });
    }

    const current = memo.current.current;
    setCurrentCover(current);
  };

  const bind = useGesture(
    {
      onDrag: handler,
      onWheel: handler,
    },
    { drag: { keyboardDisplacement: size / 10 } }
  );

  return (
    <div
      style={{
        padding: `${size}px calc(50% - ${size / 2}px) ${size}px calc(50% - ${
          size / 2
        }px)`,
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
          perspectiveOrigin: `calc(0% + ${size / 2}px) 50%`,
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
                  setCurrentCover(current);
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
