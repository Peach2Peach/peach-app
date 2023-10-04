import { shallow } from 'zustand/shallow'
import { useNavigation, useRoute, useValidatedState } from '../../../hooks'
import { useSettingsStore } from '../../../store/settingsStore'

const addressRules = { bitcoinAddress: true, blockTaprootAddress: true, required: true }
const labelRules = { required: true }

export const usePayoutAddressSetup = () => {
  const route = useRoute<'payoutAddress'>()
  const { type } = route.params || {}
  const navigation = useNavigation()
  const [payoutAddress, setPayoutAddress, payoutAddressLabel, setPayoutAddressLabel] = useSettingsStore(
    (state) => [state.payoutAddress, state.setPayoutAddress, state.payoutAddressLabel, state.setPayoutAddressLabel],
    shallow,
  )
  const [address, setAddress, addressValid, addressErrors] = useValidatedState(payoutAddress || '', addressRules)
  const [addressLabel, setAddressLabel, addressLabelValid, addressLabelErrors] = useValidatedState(
    payoutAddressLabel || '',
    labelRules,
  )
  const isUpdated = address === payoutAddress && addressLabel === payoutAddressLabel

  const save = () => {
    if (addressValid && addressLabelValid) {
      const addressChanged = payoutAddress !== address
      setPayoutAddress(address)
      setPayoutAddressLabel(addressLabel)

      if (type === 'payout' && addressChanged) navigation.replace('signMessage')
      if (type === 'refund' && addressChanged) navigation.goBack()
    }
  }

  return {
    type,
    address,
    setAddress,
    addressErrors,
    addressValid,
    addressLabel,
    setAddressLabel,
    addressLabelErrors,
    addressLabelValid,
    isUpdated,
    save,
  }
}
