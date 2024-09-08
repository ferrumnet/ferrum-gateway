import { Injectable, LocalCache, NetworkedConfig } from "ferrum-plumbing";
import { Utils } from "types";

export type AbiFetcherConfig = NetworkedConfig<{
    endpoint: string;
    type: 'blockscout' | 'etherscan';
    apiKey?: string; // Optional, for Etherscan API key requirement
  }>;

export class AbiFetcher implements Injectable {
  private cache: LocalCache = new LocalCache();
  constructor(private config: AbiFetcherConfig) {
    this.config = config;
  }

  __name__(): string {
    return 'AbiFetcher';
  }

  async fetchAbi(network: string, contractAddress: string): Promise<any[] | null> {
    return this.cache.getAsync(`${network}:${contractAddress}`, () => this._fetchAbi(network, contractAddress), 3600 * 1000);
  }

  // Helper method to fetch ABI given an endpoint, API type, address, and optional API key
  private async fetchAbiForAddress(endpoint: string, type: 'blockscout' | 'etherscan', address: string, apiKey?: string): Promise<string | null> {
    let url = '';

    if (type === 'etherscan') {
      url = `${endpoint}?module=contract&action=getabi&address=${address}`;
      if (apiKey) {
        url += `&apikey=${apiKey}`;
      }
    } else if (type === 'blockscout') {
      url = `${endpoint}/api?module=contract&action=getabi&address=${address}`;
    } else {
      throw new Error(`Unsupported API type: ${type}`);
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch ABI: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.status === '1') {
        return data.result;
      } else {
        console.error(`Error fetching ABI: ${data.result}`);
        return null;
      }
    } catch (error) {
      console.error(`Error fetching ABI: ${error.message}`);
      return null;
    }
  }

  // Method to get the implementation address if the contract is a proxy
  private async getImplementationAddress(networkId: string, contractAddress: string): Promise<string> {
    // Default implementation address is the contract address itself
    let implementationAddress = contractAddress;

    // Check for proxy patterns (EIP-1967)
    const storageSlots = [
      // EIP-1967 storage slot for the implementation address
      '0x360894A13BA1A3210667C828492DB98DCA3E2076CC3735A920A3CA505D382BBC',
    ];

    for (const slot of storageSlots) {
      const slotValue = await this.getStorageAt(networkId, contractAddress, slot);
      if (slotValue && parseInt(slotValue, 16) !== 0) {
        implementationAddress = `0x${slotValue.slice(-40)}`;
        break;
      }
    }

    return implementationAddress;
  }

  // Method to get storage data at a specific slot
  private async getStorageAt(network: string, contractAddress: string, slot: string): Promise<string | null> {
    const networkConfig = this.config[network];

    if (!networkConfig) {
      throw new Error(`Unsupported network ID: ${network}`);
    }

    const { endpoint, type, apiKey } = networkConfig;
    let url = '';

    if (type === 'etherscan') {
      url = `${endpoint}?module=proxy&action=eth_getStorageAt&address=${contractAddress}&position=${slot}&tag=latest`;
      if (apiKey) {
        url += `&apikey=${apiKey}`;
      }
    } else if (type === 'blockscout') {
      url = `${endpoint}/api?module=proxy&action=eth_getStorageAt&address=${contractAddress}&position=${slot}&tag=latest`;
    } else {
      throw new Error(`Unsupported API type: ${type}`);
    }

    try {
      console.log('Getting storage at ', {url});
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch storage data: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.result?.length > 2) {
        if (!data.result.startsWith('0x') || data.result.length !== 66) {
          throw new Error('Invalid hex string length. Expected a 32-byte hex string.');
        }
        const addr = `0x${data.result.slice(-40)}`;
        if (Utils.isNonzeroAddress(addr)) return addr;
      } else {
        console.error(`Error fetching storage data: ${data.result}`);
        return null;
      }
    } catch (error) {
      console.error(`Error fetching storage data: ${error.message}`);
      return null;
    }
  }

  // Method to fetch ABI
  private async _fetchAbi(network: string, contractAddress: string): Promise<any[] | null> {
    const networkConfig = this.config[network];

    if (!networkConfig) {
      throw new Error(`Unsupported network ID: ${network}`);
    }

    const { endpoint, type, apiKey } = networkConfig;
    // Check if contract is a proxy and get the implementation address if so
    const implementationAddress = await this.getImplementationAddress(network, contractAddress);
    if (contractAddress !== implementationAddress) {
      console.log(`AbiFetcher: address "${contractAddress}" is a proxy, pointing to ${implementationAddress}`);
    }

    // Fetch ABI of the implementation contract
    const abi = await this.fetchAbiForAddress(endpoint, type, implementationAddress, apiKey);
    return abi ? JSON.parse(abi) : null;
  }
}