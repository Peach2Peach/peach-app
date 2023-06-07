import { DescriptorSecretKey, Mnemonic } from 'bdk-rn'
import { Network, WordCount } from 'bdk-rn/lib/lib/enums'

export const getDescriptorSecretKey = async (network: Network, seedphrase?: string) => {
  const mnemonic = await new Mnemonic().create(WordCount.WORDS12)

  if (seedphrase) await mnemonic.fromString(seedphrase)

  return await new DescriptorSecretKey().create(network, mnemonic)
}
