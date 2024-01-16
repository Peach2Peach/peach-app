import { useEffect } from 'react'
import { useSetToast } from '../../../components/toast/Toast'
import { useFeeEstimate } from '../../../hooks/query/useFeeEstimate'
import { useSelfUser } from '../../../hooks/query/useSelfUser'
import { useNavigation } from '../../../hooks/useNavigation'
import i18n from '../../../utils/i18n'
import { isNumber } from '../../../utils/validation/isNumber'

type Props = {
  enabled: boolean
}
export const useShowLowFeeWarning = ({ enabled }: Props) => {
  const navigation = useNavigation()
  const setToast = useSetToast()
  const { user } = useSelfUser()
  const feeRate = user?.feeRate
  const { estimatedFees } = useFeeEstimate()

  useEffect(() => {
    if (!enabled || !feeRate) return
    const rate = isNumber(feeRate) ? feeRate : estimatedFees[feeRate]
    if (rate >= estimatedFees.minimumFee) return

    setToast({
      msgKey: 'contract.warning.lowFee',
      bodyArgs: [String(estimatedFees.minimumFee)],
      level: 'WARN',
      action: {
        onPress: () => {
          navigation.navigate('networkFees')
          setToast(null)
        },
        label: i18n('contract.warning.lowFee.changeFee'),
        iconId: 'settings',
      },
    })
  }, [feeRate, navigation, enabled, estimatedFees.minimumFee, estimatedFees, setToast])
}
