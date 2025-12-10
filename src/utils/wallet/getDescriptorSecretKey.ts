import { DescriptorSecretKey, Mnemonic, Network, WordCount } from "bdk-rn";

export const getDescriptorSecretKey = async (
  network: Network,
  seedphrase?: string,
) => {
  const mnemonic = seedphrase
    ? Mnemonic.fromString(seedphrase)
    : new Mnemonic(WordCount.Words12);

  return new DescriptorSecretKey(network, mnemonic, undefined);
};
