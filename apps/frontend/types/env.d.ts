/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STELLAR_NETWORK: 'testnet' | 'mainnet';
  readonly VITE_HORIZON_URL: string;
  readonly VITE_API_BASE_URL_BACKEND: string;
  readonly VITE_API_BASE_URL_FRONTEND: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
} 
