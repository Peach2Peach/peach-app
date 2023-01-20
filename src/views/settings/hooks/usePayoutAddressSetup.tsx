import React, { useMemo } from 'react'

import shallow from 'zustand/shallow'
import { HelpIcon } from '../../../components/icons'
import { useHeaderSetup, useValidatedState } from '../../../hooks'
import { useShowHelp } from '../../../hooks/useShowHelp'
import { useSettingsStore } from '../../../store/settingsStore'
import i18n from '../../../utils/i18n'

const addressRules = { bitcoinAddress: true, required: true }
const labelRules = { required: true }

export const usePayoutAddressSetup = () => {
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

  useHeaderSetup(
    useMemo(
      () => ({
        title: i18n('settings.payoutAddress'),
        icons: [{ iconComponent: <HelpIcon />, onPress: showHelp }],
      }),
      [showHelp],
    ),
  )

  const save = () => {
    if (addressValid && addressLabelValid) {
      setPayoutAddress(address)
      setPayoutAddressLabel(addressLabel)
    }
  }

  return {
    address,
    setAddress,
    addressErrors,
    addressLabel,
    setAddressLabel,
    addressLabelErrors,
    isUpdated,
    save,
  }
}
