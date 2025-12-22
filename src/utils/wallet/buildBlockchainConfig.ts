// import { BLOCKEXPLORER, NODE_TYPE } from "@env";
// import { addProtocol } from "../web/addProtocol";
// import { NodeConfig } from "./nodeConfigStore";

// const DEFAULT_GAP_LIMIT = 25;
// const configBuilders = {
//   [BlockChainNames.Esplora]: ({
//     ssl,
//     url,
//     gapLimit,
//   }: NodeConfig & { url: string }): BlockchainEsploraConfig => ({
//     baseUrl: addProtocol(url, ssl ? "https" : "http"),
//     proxy: null,
//     concurrency: 1,
//     timeout: 30,
//     stopGap: gapLimit || DEFAULT_GAP_LIMIT,
//   }),
//   [BlockChainNames.Electrum]: ({
//     ssl,
//     url,
//     gapLimit,
//   }: NodeConfig & { url: string }): BlockchainElectrumConfig => ({
//     url: addProtocol(url, ssl ? "ssl" : "tcp"),
//     sock5: null,
//     retry: 1,
//     timeout: 5,
//     stopGap: gapLimit || DEFAULT_GAP_LIMIT,
//     validateDomain: false,
//   }),
// };
// const isValidNodeConfig = (
//   nodeConfig: NodeConfig,
// ): nodeConfig is NodeConfig & { url: string } =>
//   nodeConfig.enabled && !!nodeConfig.url;

// export const buildBlockchainConfig = (nodeConfig: NodeConfig) => {
//   if (isValidNodeConfig(nodeConfig))
//     return {
//       type: nodeConfig.type || NODE_TYPE,
//       config: configBuilders[nodeConfig.type || NODE_TYPE](nodeConfig),
//     };
//   return {
//     type: NODE_TYPE,
//     config: configBuilders[NODE_TYPE]({
//       enabled: false,
//       ssl: true,
//       url: BLOCKEXPLORER,
//     }),
//   };
// };
