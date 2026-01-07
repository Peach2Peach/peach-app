// eslint-disable-next-line no-shadow
enum BlockChainNames {
  Electrum = "Electrum",
  Esplora = "Esplora",
  // Rpc = "Rpc",
}
module "@env" {
  export const DEV: string;
  export const NETWORK: BitcoinNetwork;
  export const API_URL: string;
  export const GROUPHUG_URL: string;
  export const BLOCKEXPLORER: string;
  export const ESPLORA_URL: string;
  export const NODE_TYPE: BlockChainNames;
}
