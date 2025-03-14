import { animated, useSprings } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import { useState } from "react";

const COVER_SIZE = 400;
const FIRST_GAP = 160;
const GAP = 80;

const getX = (score: number) => {
  if (score < 1) {
    return score * FIRST_GAP;
  }
  return FIRST_GAP + GAP * score;
};

const getScore = (x: number) => {
  if (x < FIRST_GAP) {
    return x / FIRST_GAP;
  }
  return (x - FIRST_GAP) / GAP + 1;
};

const getRotateY = (score: number) => {
  if (score < 1) {
    return score * -40;
  }
  return -40;
};

const getScale = (score: number) => {
  if (score < 1) {
    return 1 - 0.2 * score;
  }
  if (score < 2) {
    return 0.8 - 0.05 * (score - 1);
  }
  return 0.75;
};

const getTransform = (
  index: number,
  x: number
): {
  scale: number;
  x: number;
  rotateY: string;
} => {
  const score = getScore(x) + index;

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

export const Coverflow = ({ width }: { width: number }) => {
  const [current, setCurrent] = useState(0);

  const [covers, coversApi] = useSprings(10, (index) => getTransform(index, 0));

  const bind = useDrag(
    ({ offset: [x] }) => {
      coversApi.start((index) => getTransform(index, x));
      setCurrent(Math.floor(-x / COVER_SIZE));
    },
    {
      bounds: { right: 0 },
      rubberband: true,
    }
  );

  return (
    <div>
      <div
        {...bind()}
        style={{
          overflowX: "hidden",
          touchAction: "none",
          position: "relative",
          height: COVER_SIZE,
          width,
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
              zIndex: covers.length - index,
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
