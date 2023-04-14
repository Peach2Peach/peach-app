import { useEffect, useMemo, useState } from 'react'
import { HelpIcon } from '../../../components/icons'
import { useMessageContex } from '../../../contexts/message'
import getFeeEstimateEffect from '../../../effects/getFeeEstimateEffect'
import { useHeaderSetup, useValidatedState } from '../../../hooks'
import { useShowHelp } from '../../../hooks/useShowHelp'
import i18n from '../../../utils/i18n'
import { useSettingsStore } from '../../../store/settingsStore'
import { updateUser } from '../../../utils/peachAPI'
import { shallow } from 'zustand/shallow'

const customFeeRules = {
  required: true,
  feeRate: true,
}
export const useNetworkFeesSetup = () => {
  const [, updateMessage] = useMessageContex()

  const showHelp = useShowHelp('networkFees')
  const [estimatedFees, setEstimatedFees] = useState<FeeRecommendation>({
    fastestFee: 1,
    halfHourFee: 1,
    hourFee: 1,
    economyFee: 1,
    minimumFee: 1,
  })

  const [feeRate, setFeeRate] = useSettingsStore((state) => [state.feeRate, state.setFeeRate], shallow)

  const [selectedFeeRate, setSelectedFeeRate] = useState<FeeRate | number>(
    !!feeRate ? (typeof feeRate === 'number' ? 'custom' : feeRate) : 'halfHourFee',
  )
  const [customFeeRate, setCustomFeeRate, isValid] = useValidatedState(
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

  useEffect(
    getFeeEstimateEffect({
      interval: 60 * 1000,
      onSuccess: (result) => {
        setEstimatedFees(result)
      },
    }),
    [],
  )

  useEffect(() => {
    if (!customFeeRate || isNaN(Number(customFeeRate)) || customFeeRate === '0') setCustomFeeRate(undefined)
  }, [customFeeRate, selectedFeeRate, setCustomFeeRate])

  useEffect(() => {
    setFeeRateSet(feeRate === selectedFeeRate && feeRate === Number(customFeeRate))
  }, [customFeeRate, feeRate, selectedFeeRate, setCustomFeeRate])

  return {
    estimatedFees,
    selectedFeeRate,
    setSelectedFeeRate,
    customFeeRate,
    setCustomFeeRate,
    submit,
    isValid,
    feeRateSet,
  }
}
