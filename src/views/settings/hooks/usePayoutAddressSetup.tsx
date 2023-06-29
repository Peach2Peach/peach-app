import { shallow } from 'zustand/shallow'
import { useHeaderSetup, useNavigation, useRoute, useValidatedState } from '../../../hooks'
import { useShowHelp } from '../../../hooks/useShowHelp'
import { useSettingsStore } from '../../../store/settingsStore'
import i18n from '../../../utils/i18n'
import { headerIcons } from '../../../utils/layout/headerIcons'

const addressRules = { bitcoinAddress: true, blockTaprootAddress: true, required: true }
const labelRules = { required: true }
const title = {
  refund: 'settings.refundAddress',
  payout: 'settings.payoutAddress',
}
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
  const showHelp = useShowHelp('payoutAddress')

  useHeaderSetup({
    title: i18n(title[type || 'payout']),
    icons: [{ ...headerIcons.help, onPress: showHelp }],
  })

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
