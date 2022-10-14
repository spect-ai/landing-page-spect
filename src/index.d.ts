export interface FormType {
  name: string;
  circleId: string;
  slug: string;
  private: boolean;
  description: string;
  properties: {
    [key: string]: {
      type: string;
      name: string;
      default: string;
      isPartOfFormView: boolean;
      options?: {
        label: string;
        value: string;
      }[];
    };
  };
  propertyOrder: string[];
  creator: string;
  parents: {
    id: string;
    name: string;
    slug: string;
  }[];
  defaultView: string;
  formRoleGating: number[];
  canFillForm: boolean;
  createdAt: string;
  updatedAt: string;
  id: string;
}

export type Registry = {
  [chainId: string]: NetworkInfo;
};

export type NetworkInfo = {
  distributorAddress?: string;
  name: string;
  mainnet: boolean;
  chainId: string;
  nativeCurrency: string;
  pictureUrl: string;
  blockExplorer?: string;
  provider: string;
  tokenDetails: { [tokenAddress: string]: Token };
};

export type Chain = {
  chainId: string;
  name: string;
};

export type Token = {
  address: string;
  symbol: string;
  name: string;
};

export type Reward = {
  chain: Chain;
  token: Token;
  value: number;
};
