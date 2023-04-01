import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Month } from 'src/entities/month.entity';
import { Spot } from 'src/entities/spot.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SpotService {
  constructor(
    @InjectRepository(Spot)
    private spotRepository: Repository<Spot>,
    @InjectRepository(Month)
    private monthRepository: Repository<Month>,
  ) {}

  async create(spot: Spot): Promise<Spot> {
    return this.spotRepository.save(spot);
  }
}
