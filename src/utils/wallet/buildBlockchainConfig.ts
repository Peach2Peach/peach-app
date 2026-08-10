import { BLOCKEXPLORER, ESPLORA_URL, ESPLORA_URL_2, NODE_TYPE } from "@env";
import { ElectrumClient, EsploraClient } from "bdk-rn";
import type { NymProxyEndpoint } from "nym-rn";
import { addProtocol } from "../web/addProtocol";
import { BlockChainNames } from "./bdkShim";
import { NodeConfig } from "./nodeConfigStore";

export type BlockchainClient = ElectrumClient | EsploraClient;

const DEFAULT_GAP_LIMIT = 25;

// Esplora endpoint for the WALLET's own chain client, and nothing else —
// explorer links (showAddress/showTransaction) and fee estimates keep using
// ESPLORA_URL. ESPLORA_URL_2 is only defined in .env.production today, so fall
// back rather than handing the client an `undefined` url on the other envs.
const WALLET_ESPLORA_URL = ESPLORA_URL_2 || ESPLORA_URL;
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
  // A custom node is taken exactly as configured: it is the user's explicit
  // choice, so we never move it (and the mixnet is only offered for it when it
  // is already Esplora — see isMixnetAllowedNode).
  if (isValidNodeConfig(nodeConfig)) {
    const type = nodeConfig.type || (NODE_TYPE as BlockChainNames);
    const builder =
      clientBuilders[type] || clientBuilders[BlockChainNames.Esplora];
    return {
      type,
      client: builder(nodeConfig, proxy),
      gapLimit: nodeConfig.gapLimit || DEFAULT_GAP_LIMIT,
    };
  }

  // The built-in node. `proxy` is only set once the mixnet is actually
  // connected, and the env default may be Electrum, whose ports public exit
  // policies block — so while routed, use the env's Esplora endpoint (HTTPS/443,
  // which exits allow) instead. Losing the mixnet reverts to the env default on
  // the next configure. Keying off `proxy` rather than the "mixnet enabled"
  // setting is deliberate: enabled-but-not-connected must NOT build an Esplora
  // client with no proxy, which would send wallet traffic out directly.
  const routed = !!proxy;
  const type = routed
    ? BlockChainNames.Esplora
    : (NODE_TYPE as BlockChainNames);
  // The url follows the resolved type, so it is NOT taken from nodeConfig here:
  // a switched-off custom node leaves its `type` behind in the store, which used
  // to pair a stale Esplora type with the Electrum BLOCKEXPLORER url. Esplora
  // gets the wallet's dedicated endpoint; anything else keeps BLOCKEXPLORER.
  const defaultConfig: NodeConfig & { url: string } = {
    enabled: false,
    ssl: true,
    url:
      type === BlockChainNames.Esplora ? WALLET_ESPLORA_URL : BLOCKEXPLORER,
    gapLimit: nodeConfig.gapLimit || DEFAULT_GAP_LIMIT,
  };

  const builder =
    clientBuilders[type] || clientBuilders[BlockChainNames.Esplora];
  return {
    type,
    client: builder(defaultConfig, proxy),
    gapLimit: defaultConfig.gapLimit || DEFAULT_GAP_LIMIT,
  };
};
