import { PowerOperating } from './stove-state.entity';
import { StoveEntity } from './stove.entity';

describe('Entities', () => {
  describe('StoveEntity', () => {
    it('should calculate consumption', () => {
      // Arrange
      const stove = new StoveEntity(
        '1',
        'mac-address',
        [100, 200, 300, 400, 500],
        1,
        1000,
      );

      const previousPower: PowerOperating = {
        hoursService: 0,
        power1Operating: 0,
        power2Operating: 0,
        power3Operating: 0,
        power4Operating: 0,
        power5Operating: 0,
      };
      const newPower: PowerOperating = {
        hoursService: 0,
        power1Operating: 60,
        power2Operating: 60,
        power3Operating: 60,
        power4Operating: 60,
        power5Operating: 60,
      };

      // Act
      const consumption = stove.calculateConsumption(previousPower, newPower);

      // Assert
      expect(consumption).toBe(1.5);
    });
  });
});
