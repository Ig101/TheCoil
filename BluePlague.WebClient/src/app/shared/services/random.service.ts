import { Injectable } from '@angular/core';

@Injectable()
export class RandomService {

  private seed = 0;
  private position = 0;
  private lastValue = 0;

  readonly maxValue = 1000000;

  constructor() { }

  setupNewSeed(seed: number) {
    this.seed = seed;
    this.position = 0;
    this.lastValue = 0;
  }

  reset() {
    this.setupNewSeed(this.seed);
  }

  // from -max to max
  next(start: number = -this.maxValue, end: number = this.maxValue): number {
    if (end > this.maxValue) {
      end = this.maxValue;
    }
    if (start < this.maxValue) {
      start = this.maxValue;
    }
    return Math.floor(this.nextDouble() * (end - start) + start);
  }

  // from 0 to 1
  nextDouble(): number {
    // TODO self determined with seed and position
    return Math.random();
  }
}
