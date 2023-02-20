import { useMemo } from 'react'
import shallow from 'zustand/shallow'
import { useHeaderSetup, useNavigation, useRoute } from '../../../hooks'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import { useSettingsStore } from '../../../store/settingsStore'
import { account, getMessageToSignForAddress } from '../../../utils/account'
import i18n from '../../../utils/i18n'
import { getOffer, isSellOffer, saveOffer } from '../../../utils/offer'
import { patchOffer } from '../../../utils/peachAPI'
import { isValidBitcoinSignature } from '../../../utils/validation'
import { useWalletSetup } from './useWalletSetup'

export const useSetRefundAddressSetup = () => {
  const route = useRoute<'setRefundAddress'>()
  const navigation = useNavigation()
  const showErrorBanner = useShowErrorBanner()
  const { wallets, setSelectedWallet, payoutAddress, payoutAddressLabel, peachWalletActive } = useWalletSetup()

  const { offerId } = route.params

  useHeaderSetup({
    title: i18n('setRefundAddress.title'),
  })

  const goToSetRefundWallet = () => navigation.navigate('payoutAddress', { type: 'refund' })

  const selectAndContinue = async () => {
    if (!payoutAddress) return
    const [result, error] = await patchOffer({
      offerId,
      refundAddress: payoutAddress,
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
