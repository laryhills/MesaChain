import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from './config/config.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('config')
  getConfig() {
    return {
      stellarNetwork: this.configService.stellarNetwork,
      horizonUrl: this.configService.horizonUrl,
      apiBaseUrlBackend: this.configService.apiBaseUrlBackend,
      apiBaseUrlFrontend: this.configService.apiBaseUrlFrontend,
      stellarNetworkPassphrase: this.configService.stellarNetworkPassphrase,
    };
  }
} 
