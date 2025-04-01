export abstract class StoveControlPort {
  abstract turnOn(stoveId: string): Promise<void>;
  abstract turnOff(stoveId: string): Promise<void>;
}