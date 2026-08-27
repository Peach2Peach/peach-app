// eslint-disable-next-line no-shadow
enum BlockChainNames {
  Electrum = "Electrum",
  Esplora = "Esplora",
  Rpc = "Rpc",
}
module "@env" {
  export const DEV: string;
  export const NETWORK: BitcoinNetwork;
  export const API_URL: string;
  export const GROUPHUG_URL: string;
  export const BLOCKEXPLORER: string;
  export const ESPLORA_URL: string;
  /**
   * Esplora endpoint reserved for the WALLET's blockchain client. Deliberately
   * separate from ESPLORA_URL, which stays in use for explorer links and fee
   * estimates. Optional: currently only defined in .env.production, so consumers
   * must fall back to ESPLORA_URL — an absent var is `undefined` at runtime.
   */
  export const ESPLORA_URL_2: string | undefined;
  export const NODE_TYPE: BlockChainNames;
}
