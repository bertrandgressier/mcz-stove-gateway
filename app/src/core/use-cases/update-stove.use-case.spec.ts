import { mock, MockProxy } from 'jest-mock-extended';
import { StoveState } from '../entities/stove-state.entity';
import { StovePublisherPort } from '../port/driver/stove-publisher.port';
import { UpdateStoveStateUseCase } from './update-stove-state.use-case';

describe('StoveEntity Domain', () => {
  let stovePublisherPort: MockProxy<StovePublisherPort>;

  beforeEach(() => {
    stovePublisherPort = mock<StovePublisherPort>();
  });

  it('should dispatch StoveEntity Data when information has been updated', () => {
    const updateStoveInformation = new UpdateStoveStateUseCase(
      stovePublisherPort,
    );

    const dataMock: StoveState = {
      statusId: 0,
      statusDescription: 'statusDescription',
      activeMode: false,
      activePower: undefined,
      activeTemperature: 0,
      autoMode: false,
      ecoStop: false,
      fanMode: 0,
      motherBoardTemperature: 0,
      regulationMode: false,
      rpmFeedingScrew: 0,
      rpmFumes: 0,
      sleepMode: false,
      smokesTemperature: 0,
      targetTemperature: 100,
      ambientTemperature: 50,
      activated: true,
      powerOperating: {
        hoursService: 0,
        power1Operating: 0,
        power2Operating: 0,
        power3Operating: 0,
        power4Operating: 0,
        power5Operating: 0,
      },
      timestamp: 0,
    };

    updateStoveInformation.updateStoveState('1234', dataMock);
    expect(stovePublisherPort.publish).toHaveBeenCalledWith('1234', dataMock);
  });
});
