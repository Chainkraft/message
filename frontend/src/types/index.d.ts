import { MetaMaskInpageProvider } from "@metamask/providers";

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }

  namespace NodeJS {
    interface ProcessEnv {
      REACT_APP_NETWORK: string;
      REACT_APP_API_KEY: string;
      REACT_APP_API_URL: string;
      REACT_APP_PRIVATE_KEY: string;
      REACT_APP_CONTRACT_ADDRESS: string;
    }
  }
}