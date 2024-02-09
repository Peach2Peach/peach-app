import { NETWORK } from "@env";
import { networks } from "bitcoinjs-lib";

export const network =
  NETWORK === "testnet"
    ? networks.testnet
    : NETWORK === "regtest"
      ? networks.regtest
      : networks.bitcoin;

export const getNetwork = () => network;
