import { useEffect } from 'react'
import { useMessageState } from '../../../components/message/useMessageState'
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
  const updateMessage = useMessageState((state) => state.updateMessage)
  const feeRate = useFeeRate()

  useEffect(() => {
    if (!enabled || !amount) return

    const expectedFees = ESCROW_TX_SIZE * feeRate
    const feesInPercent = expectedFees / amount

    if (feesInPercent < WARNING_THRESHOLD) return

    updateMessage({
      msgKey: 'contract.warning.highFee',
      bodyArgs: [String(feeRate), (feesInPercent * 100).toFixed(1)],
      level: 'WARN',
      action: {
        callback: () => {
          navigation.navigate('networkFees')
          updateMessage({ msgKey: undefined, level: 'WARN' })
        },
        label: i18n('contract.warning.highFee.changeFee'),
        icon: 'settings',
      },
    })
  }, [updateMessage, amount, feeRate, navigation, enabled])
}
