import { useEffect } from 'react'
import { useSetToast } from '../../../components/toast/Toast'
import { CENT } from '../../../constants'
import { useFeeRate } from '../../../hooks/useFeeRate'
import { useNavigation } from '../../../hooks/useNavigation'
import i18n from '../../../utils/i18n'

const ESCROW_TX_SIZE = 173
const WARNING_THRESHOLD = 0.1

type Props = {
  enabled: boolean
  amount?: number
}
export const useShowHighFeeWarning = ({ enabled, amount }: Props) => {
  const navigation = useNavigation()
  const setToast = useSetToast()
  const feeRate = useFeeRate()

  useEffect(() => {
    if (!enabled || !amount) return

    const expectedFees = ESCROW_TX_SIZE * feeRate
    const feesInPercent = expectedFees / amount

    if (feesInPercent < WARNING_THRESHOLD) return

    setToast({
      msgKey: 'contract.warning.highFee',
      bodyArgs: [String(feeRate), (feesInPercent * CENT).toFixed(1)],
      color: 'yellow',
      action: {
        onPress: () => navigation.navigate('networkFees'),
        label: i18n('contract.warning.highFee.changeFee'),
        iconId: 'settings',
      },
    })
  }, [setToast, amount, feeRate, navigation, enabled])
}
