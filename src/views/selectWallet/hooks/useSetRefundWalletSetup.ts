import { useHeaderSetup, useNavigation, useRoute } from '../../../hooks'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import i18n from '../../../utils/i18n'
import { getOffer, isSellOffer, saveOffer } from '../../../utils/offer'
import { patchOffer } from '../../../utils/peachAPI'
import { useWalletSetup } from './useWalletSetup'

export const useSetRefundWalletSetup = () => {
  const route = useRoute<'setRefundWallet'>()
  const navigation = useNavigation()
  const showErrorBanner = useShowErrorBanner()
  const { wallets, setSelectedWallet, payoutAddress, payoutAddressLabel, peachWalletActive } = useWalletSetup()

  const { offerId } = route.params

  useHeaderSetup({
    title: i18n('setRefundWallet.title'),
  })

  const goToSetRefundWallet = () => navigation.navigate('payoutAddress', { type: 'refund' })

  const selectAndContinue = async () => {
    if (!payoutAddress) return
    const [result, error] = await patchOffer({
      offerId,
      refundWallet: payoutAddress,
    })
    if (error) showErrorBanner(error.error)
    if (result) {
      const sellOffer = getOffer(offerId)
      if (sellOffer && isSellOffer(sellOffer)) saveOffer({
        ...sellOffer,
        returnAddress: payoutAddress,
      })
    }
    navigation.goBack()
  }

  return {
    wallets,
    peachWalletActive,
    setSelectedWallet,
    payoutAddress,
    payoutAddressLabel,
    goToSetRefundWallet,
    selectAndContinue,
  }
}
