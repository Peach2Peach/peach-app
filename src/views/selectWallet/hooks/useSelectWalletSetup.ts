import { useMemo } from 'react'
import shallow from 'zustand/shallow'
import { useHeaderSetup, useNavigation, useRoute } from '../../../hooks'
import { useSettingsStore } from '../../../store/settingsStore'
import i18n from '../../../utils/i18n'

export const useSelectWalletSetup = () => {
  const route = useRoute<'selectWallet'>()
  const navigation = useNavigation()

  const { type } = route.params

  const [peachWalletActive, setPeachWalletActive, payoutAddress, payoutAddressLabel, payoutAddressSignature]
    = useSettingsStore(
      (state) => [
        state.peachWalletActive,
        state.setPeachWalletActive,
        state.payoutAddress,
        state.payoutAddressLabel,
        state.payoutAddressSignature,
      ],
      shallow,
    )
  useHeaderSetup({
    title: i18n(`${type}.wallet.select.title`),
  })

  const wallets = useMemo(() => {
    const wllts = [{ value: 'peachWallet', display: i18n('peachWallet') }]
    if (payoutAddress) wllts.push({ value: 'externalWallet', display: payoutAddressLabel || i18n('externalWallet') })
    return wllts
  }, [payoutAddress, payoutAddressLabel])

  const setSelectedWallet = (selected: string) => {
    setPeachWalletActive(selected === 'peachWallet')
  }

  const goToSetRefundWallet = () => navigation.navigate('payoutAddress')

  const selectAndContinue = () => {
    navigation.goBack()
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
