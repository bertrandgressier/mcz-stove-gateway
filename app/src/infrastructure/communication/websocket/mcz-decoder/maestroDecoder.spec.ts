import { maestroDecoder, valueDecoder } from './maestroDecoder';
import { MaestroInformation } from './mcz-stove.model';

const dataReceived = {
  stringaRicevuta:
    '01|00|06|00|00|0017|1b|ff|00|ff|00|009a|0000|0000|0000|00|00|ff|01|29|01|005f|01|01|00|00|26|46|2b|0f|010b01|01|08|21|0c|0c|07e8|004db226|0011364b|0000c798|00015a42|0003bc7e|001f1e13|0680|0000|0325|002c|00|00|01|00|00|ff|ff|ff|ff|40|32|ff|ff|01|00',
  socketChiamata: 'xxxxxxx',
};

describe('Maestro Decoder', () => {
  it('decode', () => {
    const result = maestroDecoder(dataReceived);
    expect(result).toEqual({
      activeLive: 95,
      activeModeState: true,
      activePower: 15,
      activeSet: 154,
      ambientTemperature: 13.5,
      antifreeze: true,
      boilerTemperature: 35,
      brazierState: 255,
      chronometerThermostatMode: false,
      ecoMode: true,
      fanAmbienceState: {
        auto: true,
        description: 'Auto',
        id: 6,
        level: 0,
        on: true,
      },
      fanDucted1State: {
        auto: false,
        description: 'Off',
        id: 0,
        level: 0,
        on: false,
      },
      fanDucted2State: {
        auto: false,
        description: 'Off',
        id: 0,
        level: 0,
        on: false,
      },
      fanFumeRPM: 0,
      feederScrewLiveRPM: 0,
      feederScrewSetRPM: 0,
      fumeTemperature: 23,
      ignitionState: false,
      ignitionCount: 805,
      maintenanceHours: 1664,
      messageType: 1,
      motherboardTemperature: 21.5,
      ntc3Temperature: 127.5,
      operationMode: false,
      pelletSensor: false,
      power1Operating: 1128011,
      power2Operating: 51096,
      power3Operating: 88642,
      power4Operating: 244862,
      power5Operating: 2039315,
      profileState: true,
      pufferTemperature: 127.5,
      regulationMode: true,
      returnTemperature: 127.5,
      setBoiler: 50,
      setHealth: 255,
      setPuffer: 64,
      setTemperature: 19,
      shutdownMinutes: 0,
      silenceMode: false,
      sleepMode: false,
      soundEffect: false,
      soundEffectState: true,
      stoveDay: 12,
      stoveHour: 8,
      stoveMinute: 33,
      stoveMonth: 12,
      stoveStatus: {
        description: 'Off',
        id: 0,
      },
      stoveYear: 2024,
      totalOperating: 5091878,
      unknown19: 41,
      unknown30: 68353,
      unknown31: true,
      unknown46: 44,
      wifiSensorTemperature1: 127.5,
      wifiSensorTemperature2: 127.5,
      wifiSensorTemperature3: 127.5,
    });
  });

  it('create table', () => {
    const table = dataReceived.stringaRicevuta
      .split('|')
      .map((value, index) => {
        return [
          value,
          valueDecoder(value, MaestroInformation[index]?.type),
          MaestroInformation[index]?.type,
          MaestroInformation[index]?.description,
        ];
      });

    console.table(table);
  });
});
