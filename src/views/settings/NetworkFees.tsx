import { ReactElement, useContext, useEffect, useState } from 'react'
import { View } from 'react-native'

import tw from '../../styles/tailwind'

import { HorizontalLine, PeachScrollView, PrimaryButton, RadioButtons, Text } from '../../components'
import { MessageContext } from '../../contexts/message'
import { useValidatedState } from '../../hooks'
import i18n from '../../utils/i18n'
import { updateUser } from '../../utils/peachAPI'
import CustomFeeItem from './components/networkFees/CustomFeeItem'
import EstimatedFeeItem from './components/networkFees/EstimatedFeeItem'
import { useNetworkFeesSetup } from './hooks/useNetworkFeesSetup'
import { useSettingsStore } from '../../store/settingsStore'
import { shallow } from 'zustand/shallow'

const customFeeRules = {
  required: true,
  feeRate: true,
}

const estimatedFeeRates: FeeRate[] = ['fastestFee', 'halfHourFee', 'hourFee', 'custom']

export default (): ReactElement => {
  const [, updateMessage] = useContext(MessageContext)
  const { estimatedFees } = useNetworkFeesSetup()

  const [feeRate, setFeeRate] = useSettingsStore((state) => [state.feeRate, state.setFeeRate], shallow)

  const [selectedFeeRate, setSelectedFeeRate] = useState<FeeRate | number>(
    !!feeRate ? (typeof feeRate === 'number' ? 'custom' : feeRate) : 'halfHourFee',
  )
  const [customFeeRate, setCustomFeeRate, isValid] = useValidatedState<string>(
    typeof feeRate === 'number' ? feeRate.toString() : '1',
    customFeeRules,
  )
  const [feeRateSet, setFeeRateSet] = useState(true)

  const options = estimatedFeeRates.map((rate) => ({
    value: rate,
    display:
      rate === 'custom' ? (
        <CustomFeeItem {...{ customFeeRate, setCustomFeeRate, disabled: selectedFeeRate !== 'custom' }} />
      ) : (
        <EstimatedFeeItem {...{ feeRate: rate, estimatedFees: estimatedFees[rate] }} />
      ),
  }))

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
    if (!customFeeRate || isNaN(Number(customFeeRate)) || customFeeRate === '0') setCustomFeeRate('1')
  }, [selectedFeeRate, setCustomFeeRate])

  useEffect(() => {
    setFeeRateSet(feeRate === selectedFeeRate && feeRate === Number(customFeeRate))
  }, [customFeeRate, feeRate, selectedFeeRate, setCustomFeeRate])

  return (
    <View style={tw`flex-1`}>
      <PeachScrollView contentContainerStyle={tw`justify-center flex-1 p-8`}>
        <RadioButtons
          {...{
            items: options,
            selectedValue: selectedFeeRate,
            onChange: setSelectedFeeRate,
          }}
        />
        <HorizontalLine style={tw`mt-8`} />
        <Text style={tw`mt-4 text-center text-black-2`}>{i18n('settings.networkFees.averageFees')}</Text>
        <Text style={tw`text-center subtitle-1`}>
          {i18n('settings.networkFees.xSatsPerByte', estimatedFees.economyFee.toString())}
        </Text>
      </PeachScrollView>
      <PrimaryButton onPress={submit} disabled={!isValid || feeRateSet} style={tw`self-center m-8`}>
        {i18n(feeRateSet ? 'settings.networkFees.feeRateSet' : 'confirm')}
      </PrimaryButton>
    </View>
  )
}
