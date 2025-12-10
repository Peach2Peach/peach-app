import { Network } from "bdk-rn";

export const convertBitcoinNetworkToBDKNetwork = (
  network: BitcoinNetwork,
): Network => {
  if (network === "bitcoin") {
    return Network.Bitcoin;
  }
  if (network === "testnet") {
    return Network.Testnet;
  }
  if (network === "regtest") {
    return Network.Regtest;
  }

  throw Error(`Unknown network: ${network}`);
};
