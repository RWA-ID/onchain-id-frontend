import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Onchain ID',
  projectId: '3a8170812b534d0ff9d794f35a9cc25e', // Valid WalletConnect Project ID for RainbowKit
  chains: [base],
  ssr: false, 
});
