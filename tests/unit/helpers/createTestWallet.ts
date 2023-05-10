import { createWalletFromSeedPhrase, getNetwork } from '../../../src/utils/wallet'

export const createTestWallet = () => {
  const network = getNetwork()
  const mnemonic = 'mom mom mom mom mom mom mom mom mom mom mom mom mom mom mom mom'
  const recoveredWallet = createWalletFromSeedPhrase(mnemonic, network)
  return recoveredWallet.wallet
}
