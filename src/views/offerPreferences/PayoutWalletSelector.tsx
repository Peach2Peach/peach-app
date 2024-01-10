import { shallow } from 'zustand/shallow'
import { useNavigation } from '../../hooks/useNavigation'
import { useSettingsStore } from '../../store/settingsStore/useSettingsStore'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { WalletSelector } from './WalletSelector'

export function PayoutWalletSelector ({ offerId }: { offerId?: string }) {
  const [payoutToPeachWallet, payoutAddress, payoutAddressLabel, setPayoutToPeachWallet] = useSettingsStore(
    (state) => [state.payoutToPeachWallet, state.payoutAddress, state.payoutAddressLabel, state.setPayoutToPeachWallet],
    shallow,
  )
  const navigation = useNavigation()

  const onExternalWalletPress = () => {
    if (payoutAddress) {
      setPayoutToPeachWallet(false)
    } else if (!offerId) {
      navigation.navigate('payoutAddress')
    } else {
      navigation.navigate('patchPayoutAddress', { offerId })
    }
  }

  const onPeachWalletPress = () => setPayoutToPeachWallet(true)

  return (
    <WalletSelector
      title={i18n('offerPreferences.payoutTo')}
      backgroundColor={tw.color('success-mild-1')}
      bubbleColor="green"
      peachWalletActive={payoutToPeachWallet}
      address={payoutAddress}
      addressLabel={payoutAddressLabel}
      onPeachWalletPress={onPeachWalletPress}
      onExternalWalletPress={onExternalWalletPress}
    />
  )
}
