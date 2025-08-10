import { animated, useSpring, useSprings } from "@react-spring/web";
import { Handler, useGesture } from "@use-gesture/react";
import { useMemo, useRef, useState } from "react";
import { Cover } from "./cover";
import { Util as CoverUtil } from "./cover.util";
import { Util as ModalUtil } from "./modal.util";

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

  const coverUtil = useMemo(() => new CoverUtil(size), [size]);
  const modalUtil = useMemo(() => new ModalUtil(), []);

  const [current, setCurrnet] = useState(0);

  const [covers, coversApi] = useSprings(coverData.length, (score) => {
    return coverUtil.getTransform(score);
  });

  const [modal, modalApi] = useSpring(() => modalUtil.getInvisibleTransform());

  const setCurrentCover = (current: number) => {
    setCurrnet(current);
    onChange?.(current);
    onSelected?.(current);
    memo.current.prevCurrent = current;
    return coversApi.start((index) => {
      return coverUtil.getTransform(index - current);
    });
  };

  const clickHandler = (target: number) => {
    coversApi.start((index) => {
      if (index === target) {
        modalApi.start(modalUtil.getVisibleTransform());
        return modalUtil.getFlippedCoverTransform();
      }
    });
  };

  const dragHandler: Handler<"drag" | "wheel"> = ({
    movement: [movementX],
    active,
  }) => {
    if (active) {
      const { prevCurrent } = memo.current;

      const diffScore = coverUtil.getDiffScore(
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
        return coverUtil.getTransform(score);
      });
    }

    const current = memo.current.current;
    setCurrentCover(current);
  };

  const bind = useGesture(
    {
      onDrag: dragHandler,
      onWheel: dragHandler,
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
                if (clickPosition.current === null) {
                  return;
                }

                const { x, y } = e.currentTarget.getBoundingClientRect();
                const { x: clickX, y: clickY } = clickPosition.current;
                if (Math.hypot(clickX - x, clickY - y) > CLICK_AREA) {
                  return;
                }

                if (current === index) {
                  clickHandler(index);
                  return;
                }

                setCurrentCover(index);
                clickPosition.current = null;
              }}
            />
          </animated.div>
        ))}
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore */}
        <animated.div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            zIndex: covers.length + 1,
            ...modal,
          }}
        >
          <div
            style={{
              width: size,
              height: size,
              padding: "1rem",
              backgroundColor,
            }}
          >
            여기에 데이터 입력
          </div>
        </animated.div>
      </div>
    </div>
  );
};
