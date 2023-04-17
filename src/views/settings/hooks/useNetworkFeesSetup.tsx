import { useEffect, useMemo, useState } from 'react'
import { shallow } from 'zustand/shallow'
import { HelpIcon } from '../../../components/icons'
import { useMessageContex } from '../../../contexts/message'
import { useHeaderSetup, useValidatedState } from '../../../hooks'
import { useFeeEstimate } from '../../../hooks/query/useFeeEstimate'
import { useShowHelp } from '../../../hooks/useShowHelp'
import { useSettingsStore } from '../../../store/settingsStore'
import i18n from '../../../utils/i18n'
import { updateUser } from '../../../utils/peachAPI'

const customFeeRules = {
  required: true,
  feeRate: true,
}
export const useNetworkFeesSetup = () => {
  const [, updateMessage] = useMessageContex()
  const showHelp = useShowHelp('networkFees')
  const { estimatedFees } = useFeeEstimate()

  const [feeRate, setFeeRate] = useSettingsStore((state) => [state.feeRate, state.setFeeRate], shallow)

  const [selectedFeeRate, setSelectedFeeRate] = useState<FeeRate | number>(
    typeof feeRate === 'number' ? 'custom' : feeRate,
  )
  const [customFeeRate, setCustomFeeRate, isValidCustomFeeRate] = useValidatedState(
    typeof feeRate === 'number' ? feeRate.toString() : undefined,
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

  useHeaderSetup(
    useMemo(
      () => ({
        title: i18n('settings.networkFees'),
        icons: [
          {
            iconComponent: <HelpIcon />,
            onPress: showHelp,
          },
        ],
      }),
      [showHelp],
    ),
  )

  useEffect(() => {
    if (!customFeeRate || isNaN(Number(customFeeRate)) || customFeeRate === '0') setCustomFeeRate(undefined)
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
