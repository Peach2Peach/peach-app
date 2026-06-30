import { BLOCKEXPLORER, NODE_TYPE } from "@env";
import { ElectrumClient, EsploraClient } from "bdk-rn";
import type { NymProxyEndpoint } from "nym-rn";
import { addProtocol } from "../web/addProtocol";
import { BlockChainNames } from "./bdkShim";
import { NodeConfig } from "./nodeConfigStore";

export type BlockchainClient = ElectrumClient | EsploraClient;

const DEFAULT_GAP_LIMIT = 25;
// Mixnet routing adds seconds of latency, so allow longer than the direct value.
const ELECTRUM_TIMEOUT_SECONDS = 30;
const ELECTRUM_PROXY_TIMEOUT_SECONDS = 120;
const ELECTRUM_RETRY_ATTEMPTS = 3;

const resolveUrl = (url: string, defaultScheme: string) =>
  url.includes("://") ? url : addProtocol(url, defaultScheme);

// bdk's Esplora client uses `minreq`, which only supports HTTP-CONNECT proxies
// (no SOCKS5) — so it gets the bridge's "host:port", NOT the socks5 url.
// ElectrumClient uses electrum-client, which speaks SOCKS5 directly ("host:port").
const esploraProxy = (proxy?: NymProxyEndpoint) => proxy?.httpProxy ?? undefined;
const electrumProxy = (proxy?: NymProxyEndpoint) =>
  proxy ? `${proxy.host}:${proxy.port}` : undefined;

const clientBuilders = {
  [BlockChainNames.Esplora]: (
    { ssl, url }: NodeConfig & { url: string },
    proxy?: NymProxyEndpoint,
  ): BlockchainClient =>
    new EsploraClient(resolveUrl(url, ssl ? "https" : "http"), esploraProxy(proxy)),
  [BlockChainNames.Electrum]: (
    { ssl, url }: NodeConfig & { url: string },
    proxy?: NymProxyEndpoint,
  ): BlockchainClient =>
    new ElectrumClient(
      resolveUrl(url, ssl ? "ssl" : "tcp"),
      electrumProxy(proxy),
      proxy ? ELECTRUM_PROXY_TIMEOUT_SECONDS : ELECTRUM_TIMEOUT_SECONDS,
      ELECTRUM_RETRY_ATTEMPTS,
      true,
    ),
  [BlockChainNames.Rpc]: (
    { ssl, url }: NodeConfig & { url: string },
    proxy?: NymProxyEndpoint,
  ): BlockchainClient =>
    new EsploraClient(resolveUrl(url, ssl ? "https" : "http"), esploraProxy(proxy)),
};

const isValidNodeConfig = (
  nodeConfig: NodeConfig,
): nodeConfig is NodeConfig & { url: string } =>
  nodeConfig.enabled && !!nodeConfig.url;

export const buildBlockchainConfig = (
  nodeConfig: NodeConfig,
  proxy?: NymProxyEndpoint,
) => {
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
    client: builder(effectiveConfig, proxy),
    gapLimit: effectiveConfig.gapLimit || DEFAULT_GAP_LIMIT,
  };
};
