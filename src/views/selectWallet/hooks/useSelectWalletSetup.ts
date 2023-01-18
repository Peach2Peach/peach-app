import shallow from 'zustand/shallow'
import { useHeaderSetup, useRoute } from '../../../hooks'
import { useSettingsStore } from '../../../store/settingsStore'
import i18n from '../../../utils/i18n'

export const useSelectWalletSetup = () => {
  const route = useRoute<'selectWallet'>()
  const { type } = route.params

  const [peachWalletActive, setPeachWalletActive, payoutAddress, payoutAddressLabel] = useSettingsStore(
    (state) => [state.peachWalletActive, state.setPeachWalletActive, state.payoutAddress, state.payoutAddressLabel],
    shallow,
  )
  useHeaderSetup({
    title: i18n(`${type}.wallet.select.title`),
  })

  return { peachWalletActive, setPeachWalletActive, payoutAddress, payoutAddressLabel }
}
