import { Controller, Get } from '@nestjs/common';
import { SpotService } from './spot.service';

@Controller('spot')
export class SpotController {
  constructor(private spotService: SpotService) {}

  @Get()
  async getSpotById(id: string) {
    
  }
}
