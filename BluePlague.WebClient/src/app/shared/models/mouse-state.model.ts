export interface MouseState {
  x: number;
  y: number;
  realX: number;
  realY: number;
  buttonsInfo: {[id: number]: { pressed: boolean, timeStamp: number }; };
}
