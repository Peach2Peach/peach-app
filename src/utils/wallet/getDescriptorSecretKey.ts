import { DescriptorSecretKey, Mnemonic, WordCount } from "bdk-rn";
import { bdkNetworkKind } from "./bdkShim";

export const getDescriptorSecretKey = (
  network: string,
  seedphrase?: string,
) => {
  const mnemonic = seedphrase
    ? Mnemonic.fromString(seedphrase)
    : new Mnemonic(WordCount.Words12);

  return new DescriptorSecretKey(bdkNetworkKind(network), mnemonic, undefined);
};
