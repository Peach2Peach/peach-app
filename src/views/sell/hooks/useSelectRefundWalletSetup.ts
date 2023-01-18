import shallow from 'zustand/shallow'
import { useHeaderSetup } from '../../../hooks'
import { useSettingsStore } from '../../../store/settingsStore'
import i18n from '../../../utils/i18n'

export const useSelectRefundWalletSetup = () => {
  const [peachWalletActive, setPeachWalletActive, payoutAddress, payoutAddressLabel] = useSettingsStore(
    (state) => [state.peachWalletActive, state.setPeachWalletActive, state.payoutAddress, state.payoutAddressLabel],
    shallow,
  )
  useHeaderSetup({
    title: i18n('sell.wallet.select.title'),
  })

  return { peachWalletActive, setPeachWalletActive, payoutAddress, payoutAddressLabel }
}
