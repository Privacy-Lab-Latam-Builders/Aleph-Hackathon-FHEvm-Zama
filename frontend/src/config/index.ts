import '@rainbow-me/rainbowkit/styles.css';

import {
  getDefaultConfig,
} from '@rainbow-me/rainbowkit';
import {
  sepolia
} from 'wagmi/chains';
import {
  QueryClient,
} from "@tanstack/react-query";

export const queryClient = new QueryClient();

export const config = getDefaultConfig({
    appName: 'CONPRO APP',
    projectId: 'YOUR_PROJECT_ID', // TODO: Replace this for WalletCOnnect project ID
    chains: [sepolia],
    ssr: true, // If your dApp uses server side rendering (SSR)
  });
