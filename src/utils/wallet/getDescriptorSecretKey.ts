import { DescriptorSecretKey, Mnemonic } from "bdk-rn";
import { Network, WordCount } from "bdk-rn/lib/lib/enums";

export const getDescriptorSecretKey = async (
  network: Network,
  seedphrase?: string,
) => {
  let mnemonic = new Mnemonic();

  if (seedphrase) {
    mnemonic = await mnemonic.fromString(seedphrase);
  } else {
    mnemonic = await mnemonic.create(WordCount.WORDS12);
  }

  return new DescriptorSecretKey().create(network, mnemonic);
};
