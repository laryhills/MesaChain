/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly NEXT_PUBLIC_STELLAR_NETWORK: 'testnet' | 'mainnet';
  readonly NEXT_PUBLIC_HORIZON_URL: string;
  readonly NEXT_PUBLIC_API_BASE_URL_BACKEND: string;
  readonly NEXT_PUBLIC_API_BASE_URL_FRONTEND: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
} 
