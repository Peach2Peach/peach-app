import { useNavigation, useRoute } from '../../../hooks'
import { getMessageToSignForAddress } from '../../../utils/account'
import { useAccountStore } from '../../../utils/account/account'
import { isValidBitcoinSignature } from '../../../utils/validation'
import { useWalletSetup } from './useWalletSetup'

export const useSelectWalletSetup = () => {
  const { wallets, setSelectedWallet, peachWalletActive, payoutAddress, payoutAddressLabel, payoutAddressSignature }
    = useWalletSetup()
  const route = useRoute<'selectWallet'>()
  const navigation = useNavigation()
  const publicKey = useAccountStore((state) => state.account.publicKey)

  const { type } = route.params

  const goToSetRefundWallet = () => navigation.navigate('payoutAddress', { type })

  const selectAndContinue = (): void | undefined => {
    if (type === 'refund' || peachWalletActive) return navigation.goBack()

    if (!payoutAddress) return undefined
    const message = getMessageToSignForAddress(publicKey, payoutAddress)
    if (!payoutAddressSignature || !isValidBitcoinSignature(message, payoutAddress, payoutAddressSignature)) {
      return navigation.navigate('signMessage')
    }
    return navigation.goBack()
  }

  return {
    wallets,
    type,
    peachWalletActive,
    setSelectedWallet,
    payoutAddress,
    payoutAddressLabel,
    goToSetRefundWallet,
    selectAndContinue,
  }
}
