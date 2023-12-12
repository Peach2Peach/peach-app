import { useEffect, useState } from 'react'
import { shallow } from 'zustand/shallow'
import { useMessageState } from '../../../components/message/useMessageState'
import { useValidatedState } from '../../../hooks'
import { useFeeEstimate } from '../../../hooks/query/useFeeEstimate'
import { useSettingsStore } from '../../../store/settingsStore'
import { updateUser } from '../../../utils/peachAPI'

const customFeeRules = {
  required: true,
  feeRate: true,
}
export const useNetworkFeesSetup = () => {
  const updateMessage = useMessageState((state) => state.updateMessage)
  const { estimatedFees } = useFeeEstimate()

  const [feeRate, setFeeRate] = useSettingsStore((state) => [state.feeRate, state.setFeeRate], shallow)

  const [selectedFeeRate, setSelectedFeeRate] = useState<FeeRate | 'custom'>(
    typeof feeRate === 'number' ? 'custom' : feeRate,
  )
  const [customFeeRate, setCustomFeeRate, isValidCustomFeeRate] = useValidatedState(
    typeof feeRate === 'number' ? feeRate.toString() : '',
    customFeeRules,
  )
  const [feeRateSet, setFeeRateSet] = useState(true)

  const submit = async () => {
    const finalFeeRate = selectedFeeRate !== 'custom' ? selectedFeeRate : Number(customFeeRate)
    const [result, err] = await updateUser({
      feeRate: finalFeeRate,
    })
    if (result) {
      setFeeRate(finalFeeRate)
      setFeeRateSet(true)
    } else if (err) {
      updateMessage({
        msgKey: err.error,
        level: 'ERROR',
      })
    }
  }

  useEffect(() => {
    if (!customFeeRate || isNaN(Number(customFeeRate)) || customFeeRate === '0') setCustomFeeRate('')
  }, [customFeeRate, selectedFeeRate, setCustomFeeRate])

  useEffect(() => {
    if (selectedFeeRate === 'custom') {
      setFeeRateSet(feeRate === Number(customFeeRate))
    } else {
      setFeeRateSet(feeRate === selectedFeeRate)
    }
  }, [customFeeRate, feeRate, selectedFeeRate, setCustomFeeRate])

  return {
    estimatedFees,
    selectedFeeRate,
    setSelectedFeeRate,
    customFeeRate,
    setCustomFeeRate,
    submit,
    isValid: selectedFeeRate !== 'custom' || isValidCustomFeeRate,
    feeRateSet,
  }
}
