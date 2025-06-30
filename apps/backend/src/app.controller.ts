import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { ConfigService } from './config/config.service';
import * as client from 'prom-client';

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

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

  @Get('metrics')
  async getMetrics(@Res() res: Response) {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
  }
}
