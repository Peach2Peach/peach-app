import { shallow } from 'zustand/shallow'
import { useNavigation } from '../../hooks/useNavigation'
import { useRoute } from '../../hooks/useRoute'
import { useSettingsStore } from '../../store/settingsStore'
import { CustomAddressScreen } from './CustomAddressScreen'

export const addressRules = { bitcoinAddress: true, blockTaprootAddress: true, required: true }
export const labelRules = { required: true }

export const CustomAddress = () => {
  const { type } = useRoute<'payoutAddress'>().params || {}
  const navigation = useNavigation()

  const [payoutAddress, setPayoutAddress, payoutAddressLabel, setPayoutAddressLabel, setPeachWalletActive]
    = useSettingsStore(
      (state) => [
        state.payoutAddress,
        state.setPayoutAddress,
        state.payoutAddressLabel,
        state.setPayoutAddressLabel,
        state.setPeachWalletActive,
      ],
      shallow,
    )

  const onSave = (address: string, addressLabel: string) => {
    const addressChanged = payoutAddress !== address
    setPayoutAddress(address)
    setPayoutAddressLabel(addressLabel)

    if (addressChanged) {
      if (type === 'refund') {
        setPeachWalletActive(false)
        navigation.goBack()
      }
      if (type === 'payout') {
        navigation.replace('signMessage')
      }
    }
  }

  return (
    <CustomAddressScreen
      type={type}
      defaultAddressLabel={payoutAddressLabel || ''}
      defaultAddress={payoutAddress || ''}
      onSave={onSave}
      showRemoveWallet
    />
  )
}
