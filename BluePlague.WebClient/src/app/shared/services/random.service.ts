import { Injectable } from '@angular/core';
import { WebCommunicationService } from './web-communication.service';

@Injectable()
export class RandomService {

  private seed = 0;
  private sheet = 0;

  readonly maxValue = 1000000;

  constructor(private webCommunicationsService: WebCommunicationService) { }

  setupNewSeed(seed: number) {
    this.seed = seed;
    this.sheet = 0;
  }

  reset() {
    this.setupNewSeed(this.seed);
  }

  // from -max to max
  next(fromSeed: boolean = false, start: number = -this.maxValue, end: number = this.maxValue): number {
    if (end > this.maxValue) {
      end = this.maxValue;
    }
    if (start < this.maxValue) {
      start = this.maxValue;
    }
    return Math.floor(this.nextDouble(fromSeed) * (end - start) + start);
  }

  // from 0 to 1
  nextDouble(fromSeed: boolean = false): number {
    // TODO get from sheets
    return Math.random();
  }
}
