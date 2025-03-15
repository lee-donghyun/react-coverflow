export class Util {
  private firstGap: number;
  private gap: number;
  private firstScale: number;
  private scale: number;
  private rubber: number;

  constructor(size: number) {
    this.firstGap = (size * 220) / 400;
    this.gap = (size * 80) / 400;
    this.firstScale = -0.2;
    this.scale = -0.05;
    this.rubber = 0.15;
  }

  getX(score: number) {
    if (score < -1) {
      return -this.firstGap + this.gap * (score + 1);
    }
    if (score < 1) {
      return score * this.firstGap;
    }
    return this.firstGap + this.gap * (score - 1);
  }

  getScore(x: number) {
    if (x < -this.firstGap) {
      return (x + this.firstGap) / this.gap - 1;
    }
    if (x < this.firstGap) {
      return x / this.firstGap;
    }
    return (x - this.firstGap) / this.gap + 1;
  }

  getRotateY(score: number) {
    if (score < -1) {
      return 40;
    }
    if (score < 1) {
      return score * -40;
    }
    return -40;
  }

  getScale(score: number) {
    if (score < -2) {
      return 1 + this.firstScale + this.scale;
    }
    if (score < -1) {
      return 1 + this.firstScale - this.scale * (score + 1);
    }
    if (score < 0) {
      return 1 - this.firstScale * score;
    }
    if (score < 1) {
      return 1 + this.firstScale * score;
    }
    if (score < 2) {
      return 1 + this.firstScale + this.scale * (score - 1);
    }
    return 1 + this.firstScale + this.scale;
  }

  getTransform(score: number) {
    return {
      scale: this.getScale(score),
      x: this.getX(score),
      rotateY: `${this.getRotateY(score)}deg`,
    };
  }

  getBoundedX(baseX: number, x: number, size: number) {
    const offset = baseX + x;
    const x0 = -this.getX(0);
    const xMax = -this.getX(size - 1);
    if (offset > x0) {
      return offset * this.rubber;
    }
    if (offset < xMax) {
      return xMax + (offset - xMax) * this.rubber;
    }
    return offset;
  }
}
