// Algorithm from .NET for compatibility with backend (c) .NET Foundation and Contributors
export class Random {
  private seed: number;

  private inext: number;
  private inextp: number;
  private seedArray: number[] = new Array<number>(56);

  private readonly maxValue = 2147483647;
  private readonly maxSeed = 161803398;

  constructor(seed: number) {
    let ii: number;
    let mj: number;
    let mk: number;

    const subtraction = Math.abs(seed);
    mj = this.maxSeed - subtraction;
    this.seedArray[55] = mj;
    mk = 1;
    for (let i = 1; i < 55; i++) {
      ii = (21 * i) % 55;
      this.seedArray[ii] = mk;
      mk = mj - mk;
      if (mk < 0) {
        mk += this.maxValue;
      }
      mj = this.seedArray[ii];
    }
    for (let k = 1; k < 5; k++) {
      for (let i = 1; i < 56; i++) {
        this.seedArray[i] -= this.seedArray[1 + (i + 30) % 55];
        if (this.seedArray[i] < 0) {
          this.seedArray[i] += this.maxValue;
        }
      }
    }
    this.inext = 0;
    this.inextp = 21;
    this.seed = seed;
  }

  private sample() {
    let retVal;
    let locINext = this.inext;
    let locINextp = this.inextp;

    if (++locINext >= 56) {
      locINext = 1;
    }
    if (++locINextp >= 56) {
      locINextp = 1;
    }

    retVal = this.seedArray[locINext] - this.seedArray[locINextp];

    if (retVal === this.maxValue) {
      retVal--;
    }
    if (retVal < 0) {
      retVal += this.maxValue;
    }

    this.seedArray[locINext] = retVal;

    this.inext = locINext;
    this.inextp = locINextp;
    return retVal;
}

  // from -max to max
  next(start: number = -this.maxValue, end: number = this.maxValue): number {
    if (end > this.maxValue) {
      end = this.maxValue;
    }
    if (start < -this.maxValue) {
      start = -this.maxValue;
    }
    return Math.floor(this.nextDouble() * (end - start) + start);
  }

  // from 0 to 1
  nextDouble(): number {
    return this.sample() * (1.0 / this.maxValue);
  }
}
