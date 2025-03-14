import { animated, useSprings } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import { useState } from "react";

const COVER_SIZE = 400;

// x
const FIRST_GAP = 220;
const GAP = 80;

// scale
const FISRST_SCALE = -0.2;
const SCALE = -0.05;

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
    return 1 + FISRST_SCALE + SCALE;
  }
  if (score < -1) {
    return 1 + FISRST_SCALE + SCALE * (score + 1);
  }
  if (score < 0) {
    return 1 - FISRST_SCALE * score;
  }
  if (score < 1) {
    return 1 + FISRST_SCALE * score;
  }
  if (score < 2) {
    return 1 + FISRST_SCALE + SCALE * (score - 1);
  }
  return 1 + FISRST_SCALE + SCALE;
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

const Cover = () => (
  <div
    style={{
      width: COVER_SIZE,
      height: COVER_SIZE,

      boxSizing: "border-box",
      border: "1px solid blue",

      backgroundColor: "red",
    }}
  ></div>
);

export const Coverflow = () => {
  const [current, setCurrnet] = useState(0);
  const [baseX, setBaseX] = useState(0);
  const [covers, coversApi] = useSprings(10, (index) => {
    const score = getScore(baseX) + index;
    return getTransform(score);
  });

  const bind = useDrag(
    ({ movement: [x], active }) => {
      if (active) {
        return coversApi.start((index) => {
          const score = getScore(baseX + x) + index;

          if (Math.abs(score) <= 0.5) {
            setCurrnet(index);
          }

          return getTransform(score);
        });
      }

      setBaseX(-getX(current));
      return coversApi.start((index) => {
        return getTransform(index - current);
      });
    },
    {
      bounds: { right: 0 },
      rubberband: true,
    }
  );

  return (
    <div style={{ padding: 200, overflow: "hidden" }}>
      <div
        {...bind()}
        style={{
          touchAction: "none",
          position: "relative",

          height: COVER_SIZE,

          perspective: "600px",
        }}
      >
        {covers.map((props, index) => (
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
            <Cover />
          </animated.div>
        ))}
      </div>
      {current}
    </div>
  );
};
