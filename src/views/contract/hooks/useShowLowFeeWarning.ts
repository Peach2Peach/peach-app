import { useContext, useEffect } from 'react'
import { MessageContext } from '../../../contexts/message'
import { useNavigation } from '../../../hooks'
import { useFeeEstimate } from '../../../hooks/query/useFeeEstimate'
import { useFeeRate } from '../../../hooks/useFeeRate'
import i18n from '../../../utils/i18n'

type Props = {
  enabled: boolean
}
export const useShowLowFeeWarning = ({ enabled }: Props) => {
  const navigation = useNavigation()
  const [, updateMessage] = useContext(MessageContext)
  const feeRate = useFeeRate()
  const { estimatedFees } = useFeeEstimate()

  useEffect(() => {
    if (!enabled) return
    if (feeRate >= estimatedFees.minimumFee) return

    updateMessage({
      msgKey: 'contract.warning.lowFee',
      bodyArgs: [String(estimatedFees.minimumFee)],
      level: 'WARN',
      action: {
        callback: () => {
          navigation.navigate('networkFees')
          updateMessage({ msgKey: undefined, level: 'WARN' })
        },
        label: i18n('contract.warning.lowFee.changeFee'),
        icon: 'settingsGear',
      },
    })
  }, [updateMessage, feeRate, navigation, enabled, estimatedFees.minimumFee])
}
