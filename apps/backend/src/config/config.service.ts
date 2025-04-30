import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { ConfigSchema } from './config.schema';

@Injectable()
export class ConfigService {
  constructor(private configService: NestConfigService<ConfigSchema>) {}

  get stellarNetwork(): 'testnet' | 'mainnet' {
    return this.configService.get('STELLAR_NETWORK')!;
  }

  get horizonUrl(): string {
    return this.configService.get('HORIZON_URL')!;
  }

  get apiBaseUrlBackend(): string {
    return this.configService.get('API_BASE_URL_BACKEND')!;
  }

  get apiBaseUrlFrontend(): string {
    return this.configService.get('API_BASE_URL_FRONTEND')!;
  }

  get stellarNetworkPassphrase(): string {
    return this.stellarNetwork === 'testnet'
      ? 'Test SDF Network ; September 2015'
      : 'Public Global Stellar Network ; September 2015';
  }
} 
