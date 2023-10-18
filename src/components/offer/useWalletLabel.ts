import { useEffect, useState } from 'react'
import { shallow } from 'zustand/shallow'
import { useSettingsStore } from '../../store/settingsStore'
import i18n from '../../utils/i18n'
import { getWalletLabel } from '../../utils/offer'

type Props = ComponentProps & {
  label?: string
  address?: string
}

export const useWalletLabel = ({ label, address }: Props) => {
  const [payoutAddress, payoutAddressLabel, isPeachWalletActive] = useSettingsStore(
    (state) => [state.payoutAddress, state.payoutAddressLabel, state.peachWalletActive],
    shallow,
  )
  const [fallbackLabel, setFallbackLabel] = useState(i18n('loading'))

  useEffect(() => {
    if (label) return

    // this operation can be expensive, hence we delay execution
    setTimeout(() => {
      setFallbackLabel(
        getWalletLabel({
          address,
          customPayoutAddress: payoutAddress,
          customPayoutAddressLabel: payoutAddressLabel,
          isPeachWalletActive,
        }),
      )
    })
  }, [address, label, payoutAddress, payoutAddressLabel, isPeachWalletActive])

  return label || fallbackLabel
}
