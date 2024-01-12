import { useEffect, useState } from 'react'
import { useMessageState } from '../../../components/message/useMessageState'
import { useSelfUser } from '../../../hooks/query/useSelfUser'
import { useValidatedState } from '../../../hooks/useValidatedState'
import { updateUser } from '../../../utils/peachAPI/updateUser'

const customFeeRules = {
  required: true,
  feeRate: true,
}
export const useNetworkFeesSetup = () => {
  const updateMessage = useMessageState((state) => state.updateMessage)

  const { user } = useSelfUser()
  const feeRate = user?.feeRate

  const defaultFeeRate = feeRate ? (typeof feeRate === 'number' ? 'custom' : feeRate) : 'halfHourFee'
  const [selectedFeeRate, setSelectedFeeRate] = useState<FeeRate | 'custom'>()
  const displayRate = selectedFeeRate ?? defaultFeeRate
  const defaultCustom = typeof feeRate === 'number' ? feeRate.toString() : ''
  const [customFeeRate, setCustomFeeRate, isValidCustomFeeRate] = useValidatedState(defaultCustom, customFeeRules)
  const displayCustomRate = customFeeRate ?? defaultCustom
  const [feeRateSet, setFeeRateSet] = useState(true)

  const submit = async () => {
    const finalFeeRate = displayRate !== 'custom' ? displayRate : Number(displayCustomRate)
    const [result, err] = await updateUser({
      feeRate: finalFeeRate,
    })
    if (result) {
      setFeeRateSet(true)
    } else if (err && 'error' in err) {
      updateMessage({
        msgKey: err.error,
        level: 'ERROR',
      })
    }
  }

  useEffect(() => {
    if (!displayCustomRate || isNaN(Number(displayCustomRate)) || displayCustomRate === '0') setCustomFeeRate('')
  }, [displayCustomRate, setCustomFeeRate])

  useEffect(() => {
    if (displayRate === 'custom') {
      setFeeRateSet(feeRate === Number(displayCustomRate))
    } else {
      setFeeRateSet(feeRate === displayRate)
    }
  }, [displayCustomRate, displayRate, feeRate])

  return {
    selectedFeeRate: displayRate,
    setSelectedFeeRate,
    customFeeRate: displayCustomRate,
    setCustomFeeRate,
    submit,
    isValid: selectedFeeRate !== 'custom' || isValidCustomFeeRate,
    feeRateSet,
  }
}
