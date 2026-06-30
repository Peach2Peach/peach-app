import { NODE_TYPE } from "@env";
import { BlockChainNames } from "../bdkShim";
import type { NodeConfig } from "../nodeConfigStore";

/** The blockchain client type that will actually be used for a given config. */
export const getEffectiveNodeType = (
  node: Pick<NodeConfig, "type">,
): BlockChainNames => node.type || (NODE_TYPE as BlockChainNames);

/**
 * The mixnet is only allowed for Esplora nodes. Other client types connect over
 * non-standard ports (e.g. Electrum's 50001/50002) that public Nym exit
 * policies generally block, whereas Esplora runs over HTTPS/443, which they
 * allow. Gating here keeps users from enabling a combination that can't work.
 */
export const isMixnetAllowedNode = (node: Pick<NodeConfig, "type">): boolean =>
  getEffectiveNodeType(node) === BlockChainNames.Esplora;
