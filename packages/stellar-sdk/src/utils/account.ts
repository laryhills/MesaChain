import { Keypair } from 'stellar-sdk';

export const createAccount = () => {
  return Keypair.random();
}; 