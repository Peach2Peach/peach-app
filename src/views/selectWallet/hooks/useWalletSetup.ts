import { useMemo } from 'react'
import { shallow } from 'zustand/shallow'
import { useSettingsStore } from '../../../store/settingsStore'
import i18n from '../../../utils/i18n'

export const useWalletSetup = () => {
  const [peachWalletActive, setPeachWalletActive, payoutAddress, payoutAddressLabel, payoutAddressSignature] =
    useSettingsStore(
      (state) => [
        state.peachWalletActive,
        state.setPeachWalletActive,
        state.payoutAddress,
        state.payoutAddressLabel,
        state.payoutAddressSignature,
      ],
      shallow
    )

  const wallets = useMemo(() => {
    const wllts = [{ value: 'peachWallet', display: i18n('peachWallet') }]
    if (payoutAddress) wllts.push({ value: 'externalWallet', display: payoutAddressLabel || i18n('externalWallet') })
    return wllts
  }, [payoutAddress, payoutAddressLabel])

  const setSelectedWallet = (selected: string) => {
    setPeachWalletActive(selected === 'peachWallet')
  }

  return {
    wallets,
    peachWalletActive,
    setPeachWalletActive,
    setSelectedWallet,
    payoutAddress,
    payoutAddressLabel,
    payoutAddressSignature,
  }
}
