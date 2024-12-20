import { Injectable } from '@nestjs/common';
import { StoveEntity } from '../entities/stove.entity';
import { StoveRepositoryPort } from '../port/driver/stove-repository.port';

@Injectable()
export class GetStovesUseCase implements GetStovesUseCase {
  constructor(private readonly stoveRepository: StoveRepositoryPort) {}

  getStoves(): StoveEntity[] {
    return this.stoveRepository.listStoves();
  }
}
