import { useState } from 'react'
import { useSelfUser } from '../../../../hooks/query/useSelfUser'
import { useValidatedState } from '../../../../hooks/useValidatedState'
import { usePatchFeeRate } from './usePatchFeeRate'

const customFeeRules = {
  required: true,
  feeRate: true,
}
export const useNetworkFeesSetup = () => {
  const { user } = useSelfUser()
  const feeRate = user?.feeRate

  const defaultFeeRate = feeRate ? (typeof feeRate === 'number' ? 'custom' : feeRate) : 'halfHourFee'
  const [selectedFeeRate, setSelectedFeeRate] = useState<FeeRate | 'custom'>()
  const displayRate = selectedFeeRate ?? defaultFeeRate

  const defaultCustomFeeRate = typeof feeRate === 'number' ? feeRate.toString() : ''
  const [customFeeRate, setCustomFeeRate, isValidCustomFeeRate] = useValidatedState<string | undefined>(
    undefined,
    customFeeRules,
  )
  const displayCustomRate = customFeeRate ?? defaultCustomFeeRate

  const finalFeeRate = displayRate === 'custom' ? Number(displayCustomRate) : displayRate
  const { mutate } = usePatchFeeRate()

  const onChangeCustomFeeRate = (value: string) =>
    setCustomFeeRate(!value || isNaN(Number(value)) || value === '0' ? '' : value)

  return {
    selectedFeeRate: displayRate,
    setSelectedFeeRate,
    customFeeRate: displayCustomRate,
    setCustomFeeRate: onChangeCustomFeeRate,
    submit: () => mutate({ feeRate: finalFeeRate }),
    isValid: selectedFeeRate !== 'custom' || isValidCustomFeeRate,
    feeRateSet: displayRate === 'custom' ? feeRate === Number(displayCustomRate) : feeRate === displayRate,
  }
}
