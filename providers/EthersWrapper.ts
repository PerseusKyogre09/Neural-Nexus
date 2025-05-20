// This is a wrapper for the ethers library to handle build issues
// It will dynamically import ethers only on the client side

// Define a type for the ethers module
interface EthersType {
  BrowserProvider: any;
  Contract: any;
  formatEther: (value: any) => string;
  getDefaultProvider: (...args: any[]) => any;
  providers: {
    Web3Provider: any;
  };
  // Add other ethers types as needed
}

// Create a dummy implementation that will be replaced at runtime
const dummyEthers: EthersType = {
  BrowserProvider: class {
    constructor() {
      throw new Error('Ethers not loaded yet');
    }
  },
  Contract: class {
    constructor() {
      throw new Error('Ethers not loaded yet');
    }
  },
  formatEther: () => {
    throw new Error('Ethers not loaded yet');
  },
  getDefaultProvider: () => {
    throw new Error('Ethers not loaded yet');
  },
  providers: {
    Web3Provider: class {
      constructor() {
        throw new Error('Ethers not loaded yet');
      }
    }
  }
};

// Use a variable that can be updated at runtime
let ethers: EthersType = dummyEthers;

// Only import ethers on the client side
if (typeof window !== 'undefined') {
  // Use dynamic import to load ethers only in the browser
  import('ethers').then((module: any) => {
    ethers = module;
  }).catch((err: Error) => {
    console.error('Failed to load ethers library:', err);
  });
}

export default ethers;

// Export placeholder functions that will be replaced by actual ethers functions
export const getDefaultProvider = (...args: any[]) => {
  return ethers.getDefaultProvider(...args);
};

export const Contract = (...args: any[]) => {
  return new ethers.Contract(...args);
};

export const formatEther = (value: any) => {
  return ethers.formatEther(value);
};

export const BrowserProvider = class {
  constructor(...args: any[]) {
    return new ethers.BrowserProvider(...args);
  }
};

export const providers = {
  Web3Provider: class {
    constructor(...args: any[]) {
      return new ethers.providers.Web3Provider(...args);
    }
  }
};

// Add other ethers exports as needed 