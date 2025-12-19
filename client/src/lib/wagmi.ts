import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Onchain ID',
  projectId: '3fcc6bba6f1de962d911bb5b5c3dba68', // Valid testing Project ID from docs
  chains: [mainnet],
  ssr: false,
});
