import { NODE_TYPE } from "@env";
import { BlockChainNames } from "../bdkShim";
import type { NodeConfig } from "../nodeConfigStore";

/** The blockchain client type that will actually be used for a given config. */
export const getEffectiveNodeType = (
  node: Pick<NodeConfig, "type">,
): BlockChainNames => node.type || (NODE_TYPE as BlockChainNames);

/**
 * True when the wallet is on the built-in node rather than one the user added.
 * Mirrors the fallback condition in buildBlockchainConfig, which ignores a
 * custom config that is switched off or has no url.
 */
export const usesDefaultNode = (
  node: Pick<NodeConfig, "enabled" | "url">,
): boolean => !node.enabled || !node.url;

/**
 * Whether the mixnet may be used with this node.
 *
 * The mixnet needs Esplora: other client types connect over non-standard ports
 * (e.g. Electrum's 50001/50002) that public Nym exit policies generally block,
 * whereas Esplora runs over HTTPS/443, which they allow.
 *
 * The built-in node is always allowed even when the env default is Electrum,
 * because we are free to move it: while routed through the mixnet,
 * buildBlockchainConfig switches the default node to the env's Esplora endpoint
 * and switches back when the mixnet goes away. A CUSTOM node is the user's
 * choice, so it is taken as-is and must already be Esplora.
 */
export const isMixnetAllowedNode = (
  node: Pick<NodeConfig, "enabled" | "url" | "type">,
): boolean =>
  usesDefaultNode(node) ||
  getEffectiveNodeType(node) === BlockChainNames.Esplora;
