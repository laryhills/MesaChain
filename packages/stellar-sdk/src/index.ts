import Server from 'stellar-sdk';
import { Networks } from 'stellar-sdk';

export const server = new Server('https://horizon-testnet.stellar.org');

export const network = Networks.TESTNET;

// Export your Stellar SDK utilities here
export * from './utils'; 