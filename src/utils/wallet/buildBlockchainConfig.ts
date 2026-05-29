import { BLOCKEXPLORER, NODE_TYPE } from "@env";
import { ElectrumClient, EsploraClient } from "bdk-rn";
import { addProtocol } from "../web/addProtocol";
import { BlockChainNames } from "./bdkShim";
import { NodeConfig } from "./nodeConfigStore";

export type BlockchainClient = ElectrumClient | EsploraClient;

const DEFAULT_GAP_LIMIT = 25;

const resolveUrl = (url: string, defaultScheme: string) =>
  url.includes("://") ? url : addProtocol(url, defaultScheme);

const clientBuilders = {
  [BlockChainNames.Esplora]: ({
    ssl,
    url,
  }: NodeConfig & { url: string }): BlockchainClient =>
    new EsploraClient(resolveUrl(url, ssl ? "https" : "http"), undefined),
  [BlockChainNames.Electrum]: ({
    ssl,
    url,
  }: NodeConfig & { url: string }): BlockchainClient =>
    new ElectrumClient(
      resolveUrl(url, ssl ? "ssl" : "tcp"),
      undefined,
      false,
    ),
  [BlockChainNames.Rpc]: ({
    ssl,
    url,
  }: NodeConfig & { url: string }): BlockchainClient =>
    new EsploraClient(resolveUrl(url, ssl ? "https" : "http"), undefined),
};

const isValidNodeConfig = (
  nodeConfig: NodeConfig,
): nodeConfig is NodeConfig & { url: string } =>
  nodeConfig.enabled && !!nodeConfig.url;

export const buildBlockchainConfig = (nodeConfig: NodeConfig) => {
  const effectiveConfig: NodeConfig & { url: string } = isValidNodeConfig(
    nodeConfig,
  )
    ? nodeConfig
    : {
        enabled: false,
        ssl: true,
        url: BLOCKEXPLORER,
        gapLimit: DEFAULT_GAP_LIMIT,
      };

  const type = (nodeConfig.type || (NODE_TYPE as BlockChainNames));
  const builder = clientBuilders[type] || clientBuilders[BlockChainNames.Esplora];
  return {
    type,
    client: builder(effectiveConfig),
    gapLimit: effectiveConfig.gapLimit || DEFAULT_GAP_LIMIT,
  };
};
