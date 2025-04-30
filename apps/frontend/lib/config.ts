import { z } from 'zod';

const configSchema = z.object({
  NEXT_PUBLIC_STELLAR_NETWORK: z.enum(['testnet', 'mainnet']),
  NEXT_PUBLIC_HORIZON_URL: z.string().url(),
  NEXT_PUBLIC_API_BASE_URL_BACKEND: z.string().url(),
  NEXT_PUBLIC_API_BASE_URL_FRONTEND: z.string().url(),
});

const config = configSchema.parse({
  NEXT_PUBLIC_STELLAR_NETWORK: process.env.NEXT_PUBLIC_STELLAR_NETWORK,
  NEXT_PUBLIC_HORIZON_URL: process.env.NEXT_PUBLIC_HORIZON_URL,
  NEXT_PUBLIC_API_BASE_URL_BACKEND: process.env.NEXT_PUBLIC_API_BASE_URL_BACKEND,
  NEXT_PUBLIC_API_BASE_URL_FRONTEND: process.env.NEXT_PUBLIC_API_BASE_URL_FRONTEND,
});

export const stellarNetwork = config.NEXT_PUBLIC_STELLAR_NETWORK;
export const horizonUrl = config.NEXT_PUBLIC_HORIZON_URL;
export const apiBaseUrlBackend = config.NEXT_PUBLIC_API_BASE_URL_BACKEND;
export const apiBaseUrlFrontend = config.NEXT_PUBLIC_API_BASE_URL_FRONTEND;

export const stellarNetworkPassphrase = stellarNetwork === 'testnet'
  ? 'Test SDF Network ; September 2015'
  : 'Public Global Stellar Network ; September 2015'; 
