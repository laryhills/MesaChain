import { z } from 'zod';
import Config from 'react-native-config';

const configSchema = z.object({
  STELLAR_NETWORK: z.enum(['testnet', 'mainnet']),
  HORIZON_URL: z.string().url(),
  API_BASE_URL_BACKEND: z.string().url(),
  API_BASE_URL_FRONTEND: z.string().url(),
});

const config = configSchema.parse({
  STELLAR_NETWORK: Config.STELLAR_NETWORK,
  HORIZON_URL: Config.HORIZON_URL,
  API_BASE_URL_BACKEND: Config.API_BASE_URL_BACKEND,
  API_BASE_URL_FRONTEND: Config.API_BASE_URL_FRONTEND,
});

export const stellarNetwork = config.STELLAR_NETWORK;
export const horizonUrl = config.HORIZON_URL;
export const apiBaseUrlBackend = config.API_BASE_URL_BACKEND;
export const apiBaseUrlFrontend = config.API_BASE_URL_FRONTEND;

export const stellarNetworkPassphrase = stellarNetwork === 'testnet'
  ? 'Test SDF Network ; September 2015'
  : 'Public Global Stellar Network ; September 2015'; 
