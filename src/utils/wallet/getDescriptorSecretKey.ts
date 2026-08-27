import { DescriptorSecretKey, Mnemonic } from "bdk-rn";
import { bdkNetworkKind } from "./bdkShim";

export const getDescriptorSecretKey = (
  network: string,
  seedphrase?: string,
) => {
  // Never fall back to generating a mnemonic here: that would silently derive
  // descriptors from a throwaway seed and make the user's funds unrecoverable.
  // The one seed generator is createRandomWallet, at account creation.

  if (!seedphrase) throw Error("MISSING_SEEDPHRASE");

  const mnemonic = Mnemonic.fromString(seedphrase);
  // with BDK it is new Mnemonic(WordCount.Words12); but this is risky
  return new DescriptorSecretKey(bdkNetworkKind(network), mnemonic, undefined);
};
