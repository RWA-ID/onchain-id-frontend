import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Onchain ID',
  projectId: 'c0f730c45731362e6dc98144ee627473', // Valid example Project ID
  chains: [mainnet],
  ssr: false,
});
