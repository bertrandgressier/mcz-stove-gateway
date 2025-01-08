import {
  fanStates,
  MaestroInformation,
  MaestroMessage,
  MaestroObject,
  MaestroType,
  MessageType,
  stoveStates,
} from './mcz-stove.model';

export const valueDecoder = (value: string, type: MaestroType) => {
  switch (type) {
    case MaestroType.int:
      return parseInt(value, 16);
    case MaestroType.fan:
      return fanStates.find((fanState) => fanState.id === parseInt(value, 16));
    case MaestroType.float:
      return parseInt(value, 16) / 2;
    case MaestroType.state:
      const stoveStateId = parseInt(value, 16);
      const stoveStateResult = stoveStates.find(
        (stoveState) => stoveState.id === stoveStateId,
      );
      return stoveStateResult ?? { id: stoveStateId, description: 'Unknown' };
    case MaestroType.boolean:
      return value === '01';
  }
};

const dataDecoder = (array: string[]): MaestroObject => {
  const data: MaestroObject = {} as any;
  array.forEach((value, index) => {
    const info = MaestroInformation[index];
    if (info === undefined) return;
    data[info.label] = valueDecoder(value, info.type);
  });
  return data;
};

export const maestroDecoder = (message: MaestroMessage) => {
  try {
    const array = message.stringaRicevuta.split('|');

    const type = array[0];
    switch (type) {
      case MessageType.MESSAGE: {
        return false;
      }
      case MessageType.DATA: {
        return dataDecoder(array);
      }
      default: {
        return false;
      }
    }
  } catch (e: any) {
    throw e;
  }
};
