import { NETWORK } from "@env";
import { Address } from "bdk-rn";
import { bdkNetwork } from "../bdkShim";

export const getScriptPubKeyFromAddress = (address: string) =>
  new Address(address, bdkNetwork(NETWORK)).scriptPubkey();
