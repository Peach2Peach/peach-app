import { useEffect, useState } from 'react'
import { shallow } from 'zustand/shallow'
import { useSettingsStore } from '../../store/settingsStore'
import i18n from '../../utils/i18n'
import { getWalletLabel } from '../../utils/offer'

type Props = ComponentProps & {
  label?: string
  address?: string
}
export const WalletLabel = ({ label, address }: Props) => {
  const [payoutAddress, payoutAddressLabel] = useSettingsStore(
    (state) => [state.payoutAddress, state.payoutAddressLabel],
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
        }),
      )
    })
  }, [address, label, payoutAddress, payoutAddressLabel])

  return <>{label || fallbackLabel}</>
}
