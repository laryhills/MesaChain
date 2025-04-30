import { Injectable } from '@nestjs/common';
import { ConfigService } from './config.service';

@Injectable()
export class StellarConfig {
  constructor(private configService: ConfigService) {}

  get networkConfig() {
    const network = this.configService.stellarNetwork;
    return {
      network,
      horizonUrl: this.configService.horizonUrl,
      passphrase: this.configService.stellarNetworkPassphrase,
      quorumSet: this.getQuorumSet(network),
    };
  }

  private getQuorumSet(network: 'testnet' | 'mainnet') {
    if (network === 'testnet') {
      return {
        threshold: 2,
        validators: [
          'GDKXE2OZMJIPOSLNA6N6F2BVCI3O777I2OOC4BV7VOYUEHYX7RTRYA7Y',
          'GCUCJTIYXSOXKBSNFGNFWW5MUQ54HKRPGJUTQFJ5RQXZXNOLNXYDHRAP',
          'GC2V2EFSXN6SQTWVYA5EPJPBWWFBDGZPDXVIIF5FCZQ4S4F6L6VH5FAR',
        ],
      };
    }

    return {
      threshold: 5,
      validators: [
        'GCGB2S2KGYARPVIA37HYZXVRM2YZUEXA6S33ZU5BUDC6THSB62LZSTYH',
        'GABMKJM6I25XI4K7U6XWMULOUQIQ27BCTMLS6BYYSOWKTBUXVRJSXHYQ',
        'GCVHEKSRASJBD6O2Z532LWH4N2ZLCBVDLLTLKSYCSMBLOYTNMEEGUARD',
        'GAB6PLX7Q4V42FPVG4F6LJAT7ZJ5B5B6K5Q5A6RZHHZ3W5Z5Z5Z5Z5Z5',
        'GAEN23GHZCQWW3Z6K4P3Q4Y4Z4Z4Z4Z4Z4Z4Z4Z4Z4Z4Z4Z4Z4Z4Z4Z4',
      ],
    };
  }
} 
