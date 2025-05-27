export class Util {
  private xWeightRegion1: number;
  private xWeightRegion2: number;
  private scaleWeightRegion1: number;
  private scaleWeightRegion2: number;
  private rubber: number;

  constructor(size: number) {
    this.xWeightRegion1 = size * 0.55;
    this.xWeightRegion2 = size * 0.2;
    this.scaleWeightRegion1 = -0.2;
    this.scaleWeightRegion2 = -0.05;
    this.rubber = 0.15;
  }

  /**
   * get the x position of the cover based on its score
   * ```
   *     x                   x
   *     │                   │
   *   0 ┼─────────x         │
   *     ┼─────────┼─────────┼─
   *    -1         0         1
   * ```
   * @param score - the score of the cover, which is the index of the cover in the array
   * @returns
   */
  getX(score: number) {
    if (score < -1) {
      return -this.xWeightRegion1 + this.xWeightRegion2 * (score + 1);
    }
    if (score < 1) {
      return score * this.xWeightRegion1;
    }
    return this.xWeightRegion1 + this.xWeightRegion2 * (score - 1);
  }

  /**
   * inverse of getX. only used for calculating the score based on the x position of the first cover.
   * @param x - the x position
   * @returns score
   */
  getScore(x: number) {
    if (x < -this.xWeightRegion1) {
      return (x + this.xWeightRegion1) / this.xWeightRegion2 - 1;
    }
    if (x < this.xWeightRegion1) {
      return x / this.xWeightRegion1;
    }
    return (x - this.xWeightRegion1) / this.xWeightRegion2 + 1;
  }

  /**
   * get the rotateY of the cover based on its score
   * ```
   *   0 ┼─────────x
   *     │         │
   * -40 x         │         x
   *    ─┼─────────┼─────────┼─
   *    -1         0         1
   * ```
   * @param score - the score of the cover, which is the index of the cover in the array
   * @returns
   */
  getRotateY(score: number) {
    if (score < -1) {
      return 40;
    }
    if (score < 1) {
      return score * -40;
    }
    return -40;
  }

  /**
   * get thre scale of the cover based on its score
   * ```
   *    1 ┬─────────x
   *      │         │
   *  0.8 ┼────x    │    x
   *      │    │    │    │
   * 0.75 x    │    │    │    x
   *     ─┼────┼────┼────┼────┼─
   *     -2   -1    0    1    2
   * ```
   * @param score - the score of the cover, which is the index of the cover in the array
   * @returns
   */
  getScale(score: number) {
    if (score < -2) {
      return 1 + this.scaleWeightRegion1 + this.scaleWeightRegion2;
    }
    if (score < -1) {
      return (
        1 + this.scaleWeightRegion1 - this.scaleWeightRegion2 * (score + 1)
      );
    }
    if (score < 0) {
      return 1 - this.scaleWeightRegion1 * score;
    }
    if (score < 1) {
      return 1 + this.scaleWeightRegion1 * score;
    }
    if (score < 2) {
      return (
        1 + this.scaleWeightRegion1 + this.scaleWeightRegion2 * (score - 1)
      );
    }
    return 1 + this.scaleWeightRegion1 + this.scaleWeightRegion2;
  }

  getTransform(score: number) {
    return {
      scale: this.getScale(score),
      x: this.getX(score),
      rotateY: `${this.getRotateY(score)}deg`,
    };
  }

  /**
   * multiply the x position by a rubber band effect
   * @param baseX
   * @param x
   * @param size
   * @returns the bounded x position`
   */
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
