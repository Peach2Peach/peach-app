import { shallow } from 'zustand/shallow'
import { useNavigation } from '../../hooks/useNavigation'
import { useSettingsStore } from '../../store/settingsStore/useSettingsStore'
import { CustomAddressScreen } from './CustomAddressScreen'

export const RefundAddress = () => {
  const navigation = useNavigation()

  const [refundAddress, setRefundAddress, refundAddressLabel, setRefundAddressLabel, setRefundToPeachWallet]
    = useSettingsStore(
      (state) => [
        state.refundAddress,
        state.setRefundAddress,
        state.refundAddressLabel,
        state.setRefundAddressLabel,
        state.setRefundToPeachWallet,
      ],
      shallow,
    )

  const onSave = (address: string, addressLabel: string) => {
    setRefundAddress(address)
    setRefundAddressLabel(addressLabel)
    setRefundToPeachWallet(false)
    navigation.goBack()
  }

  return (
    <CustomAddressScreen
      defaultAddressLabel={refundAddressLabel}
      defaultAddress={refundAddress}
      onSave={onSave}
      showRemoveWallet
    />
  )
}
