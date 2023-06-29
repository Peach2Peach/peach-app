import { useSettingsStore } from '../store/useSettingsStore'
import { isNumber } from '../utils/validation'
import { useFeeEstimate } from './query/useFeeEstimate'

export const useFeeRate = () => {
  const feeRate = useSettingsStore((state) => state.feeRate)
  const { estimatedFees } = useFeeEstimate()

  if (feeRate && isNumber(feeRate)) return feeRate
  if (feeRate && !isNumber(feeRate) && estimatedFees[feeRate]) return estimatedFees[feeRate]
  return estimatedFees.halfHourFee
}
