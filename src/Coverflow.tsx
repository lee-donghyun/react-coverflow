import { animated, useSprings } from "@react-spring/web";
import { Handler, useGesture } from "@use-gesture/react";
import { MouseEvent, TouchEvent, EventHandler, useRef, useState } from "react";

const COVER_SIZE = 400;

// x
const FIRST_GAP = 220;
const GAP = 80;

// scale
const FIRST_SCALE = -0.2;
const SCALE = -0.05;

// rubber
const RUBBER = 0.15;

const getX = (score: number) => {
  if (score < -1) {
    return -FIRST_GAP + GAP * (score + 1);
  }
  if (score < 1) {
    return score * FIRST_GAP;
  }
  return FIRST_GAP + GAP * (score - 1);
};

const getScore = (x: number) => {
  if (x < -FIRST_GAP) {
    return (x + FIRST_GAP) / GAP - 1;
  }
  if (x < FIRST_GAP) {
    return x / FIRST_GAP;
  }
  return (x - FIRST_GAP) / GAP + 1;
};

const getRotateY = (score: number) => {
  if (score < -1) {
    return 40;
  }
  if (score < 1) {
    return score * -40;
  }
  return -40;
};

const getScale = (score: number) => {
  if (score < -2) {
    return 1 + FIRST_SCALE + SCALE;
  }
  if (score < -1) {
    return 1 + FIRST_SCALE - SCALE * (score + 1);
  }
  if (score < 0) {
    return 1 - FIRST_SCALE * score;
  }
  if (score < 1) {
    return 1 + FIRST_SCALE * score;
  }
  if (score < 2) {
    return 1 + FIRST_SCALE + SCALE * (score - 1);
  }
  return 1 + FIRST_SCALE + SCALE;
};

const getTransform = (
  score: number
): {
  scale: number;
  x: number;
  rotateY: string;
} => {
  return {
    scale: getScale(score),
    x: getX(score),
    rotateY: `${getRotateY(score)}deg`,
  };
};

const getBoundedX = (baseX: number, x: number, size: number) => {
  const offset = baseX + x;
  const x0 = -getX(0);
  const xMax = -getX(size - 1);
  if (offset > x0) {
    return offset * RUBBER;
  }
  if (offset < xMax) {
    return xMax + (offset - xMax) * RUBBER;
  }
  return offset;
};

const Cover = ({
  src,
  onMouseDown,
  onMouseUp,
}: {
  src: string;
  onMouseDown: EventHandler<MouseEvent | TouchEvent>;
  onMouseUp: EventHandler<MouseEvent | TouchEvent>;
}) => (
  <button
    onMouseDown={onMouseDown}
    onTouchStart={onMouseDown}
    onMouseUp={onMouseUp}
    onTouchEnd={onMouseUp}
    style={{
      padding: 0,
      margin: 0,
      background: "black",
      border: "none",

      width: COVER_SIZE,
      height: COVER_SIZE,
      position: "relative",
    }}
  >
    <div
      style={{
        position: "absolute",
        top: COVER_SIZE,
        left: 0,
        right: 0,
        height: COVER_SIZE,
        background: "black",
      }}
    ></div>
    <img
      style={{
        width: COVER_SIZE,
        height: COVER_SIZE,

        boxSizing: "border-box",

        pointerEvents: "none",
        WebkitBoxReflect:
          "below 0 linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.4))",
      }}
      src={src}
    />
  </button>
);

export const Coverflow = () => {
  const clickPosition = useRef<null | { x: number; y: number }>(null);
  const memo = useRef<{ baseScore: number; current: number }>({
    baseScore: 0,
    current: 0,
  });

  const [current, setCurrnet] = useState(0);
  const [baseX, setBaseX] = useState(0);

  const [covers, coversApi] = useSprings(100, (index) => {
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

  const bind = useGesture({ onDrag: handler, onWheel: handler });

  return (
    <div
      style={{
        padding: "20px 0 400px calc(50% - 200px)",
        overflow: "hidden",
      }}
    >
      <div
        {...bind()}
        style={{
          touchAction: "none",
          position: "relative",

          height: COVER_SIZE,

          perspective: "600px",
          perspectiveOrigin: "calc(0% + 200px) 50%",
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
              src={`${(index % 10) + 1}.jpg`}
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
                  100
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
