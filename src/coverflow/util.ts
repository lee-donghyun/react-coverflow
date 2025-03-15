// x
const FIRST_GAP = 220;
const GAP = 80;

// scale
const FIRST_SCALE = -0.2;
const SCALE = -0.05;

// rubber
const RUBBER = 0.15;

export const getX = (score: number) => {
  if (score < -1) {
    return -FIRST_GAP + GAP * (score + 1);
  }
  if (score < 1) {
    return score * FIRST_GAP;
  }
  return FIRST_GAP + GAP * (score - 1);
};

export const getScore = (x: number) => {
  if (x < -FIRST_GAP) {
    return (x + FIRST_GAP) / GAP - 1;
  }
  if (x < FIRST_GAP) {
    return x / FIRST_GAP;
  }
  return (x - FIRST_GAP) / GAP + 1;
};

export const getRotateY = (score: number) => {
  if (score < -1) {
    return 40;
  }
  if (score < 1) {
    return score * -40;
  }
  return -40;
};

export const getScale = (score: number) => {
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

export const getTransform = (
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

export const getBoundedX = (baseX: number, x: number, size: number) => {
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
