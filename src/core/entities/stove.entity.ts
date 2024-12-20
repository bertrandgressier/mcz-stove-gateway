export class StoveEntity {
  id: string;
  macAddress: string;

  constructor(id: string, macAddress: string) {
    this.id = id;
    this.macAddress = macAddress;
  }
}
