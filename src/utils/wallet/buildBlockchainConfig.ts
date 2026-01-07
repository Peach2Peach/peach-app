import { BLOCKEXPLORER, NODE_TYPE } from "@env";
import { addProtocol } from "../web/addProtocol";
import { BlockChainNames } from "./BlockChainNames";
import { NodeConfig } from "./nodeConfigStore";
const DEFAULT_GAP_LIMIT = 25;

export interface BlockchainElectrumConfig {
  url: string; // Electrum server URL (with protocol added)
  sock5: string | null; // SOCKS5 proxy, nullable
  retry: number; // Number of retry attempts
  timeout: number; // Timeout in seconds
  stopGap: number; // Gap limit for HD wallets
  validateDomain: boolean; // Whether to validate the server domain
}

// Configuration for Esplora API nodes
export interface BlockchainEsploraConfig {
  baseUrl: string; // Esplora API base URL (with protocol added)
  proxy: string | null; // Proxy URL, nullable
  concurrency: number; // Number of concurrent requests
  timeout: number; // Timeout in seconds
  stopGap: number; // Gap limit for HD wallets
}

const configBuilders = {
  [BlockChainNames.Esplora]: ({
    ssl,
    url,
    gapLimit,
  }: NodeConfig & { url: string }): BlockchainEsploraConfig => ({
    baseUrl: addProtocol(url, ssl ? "https" : "http"),
    proxy: null,
    concurrency: 1,
    timeout: 30,
    stopGap: gapLimit || DEFAULT_GAP_LIMIT,
  }),
  [BlockChainNames.Electrum]: ({
    ssl,
    url,
    gapLimit,
  }: NodeConfig & { url: string }): BlockchainElectrumConfig => ({
    url: addProtocol(url, ssl ? "ssl" : "tcp"),
    sock5: null,
    retry: 1,
    timeout: 5,
    stopGap: gapLimit || DEFAULT_GAP_LIMIT,
    validateDomain: false,
  }),
};
const isValidNodeConfig = (
  nodeConfig: NodeConfig,
): nodeConfig is NodeConfig & { url: string } =>
  nodeConfig.enabled && !!nodeConfig.url;

export const buildBlockchainConfig = (nodeConfig: NodeConfig) => {
  if (isValidNodeConfig(nodeConfig))
    return {
      type: nodeConfig.type || NODE_TYPE,
      config: configBuilders[nodeConfig.type || NODE_TYPE](nodeConfig),
    };
  return {
    type: NODE_TYPE,
    config: configBuilders[NODE_TYPE]({
      enabled: false,
      ssl: true,
      url: BLOCKEXPLORER,
    }),
  };
};
