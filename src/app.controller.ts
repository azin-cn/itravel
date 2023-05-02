import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('createSpotsDB')
  async createSpotsDB(): Promise<string> {
    await this.appService.createSpotsDB();
    return 'success';
  }

  @Post('createSpotMonthSpotFeatureDB')
  async createSpotMonthsDB() {
    await this.appService.createSpotMonthSpotFeatureDB();
    return 'success';
  }

  @Post('createSpotThumbUrl')
  async createThumbUrl() {
    await this.appService.createSpotThumbUrl();
    return 'success';
  }

  @Post('updateSpotDescription')
  async updateSpotDescription() {
    await this.appService.updateSpotDescription();
    return 'success';
  }
  @Post('replaceLocalhostToOnlineDomain')
  async replaceLocalhostToOnlineDomain() {
    await this.appService.replaceLocalhostToOnlineDomain();
    return 'success';
  }
}
