import { useEffect, useState } from 'react'
import { shallow } from 'zustand/shallow'
import { useSettingsStore } from '../../store/settingsStore'
import i18n from '../../utils/i18n'
import { getSummaryWalletLabel } from '../../utils/offer'
import { Text } from '../text'

type Props = ComponentProps & {
  label?: string
  address?: string
}
export const WalletLabel = ({ label, address, style }: Props) => {
  const [payoutAddress, payoutAddressLabel] = useSettingsStore(
    (state) => [state.payoutAddress, state.payoutAddressLabel],
    shallow,
  )
  const [walletLabel, setWalletLabel] = useState(label || i18n('loading'))

  useEffect(() => {
    if (label) return

    // this operation can be expensive, hence we delay execution
    setTimeout(() => {
      setWalletLabel(
        getSummaryWalletLabel({
          address,
          customPayoutAddress: payoutAddress,
          customPayoutAddressLabel: payoutAddressLabel,
        }) || i18n('offer.summary.customPayoutAddress'),
      )
    })
  }, [address, label, payoutAddress, payoutAddressLabel])

  return <Text style={style}>{walletLabel}</Text>
}
