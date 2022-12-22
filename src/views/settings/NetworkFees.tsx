import React, { ReactElement, useEffect, useState } from 'react'
import { View } from 'react-native'

import tw from '../../styles/tailwind'

import { GoBackButton, HorizontalLine, Input, PeachScrollView, RadioButtons, Text } from '../../components'
import { useValidatedState } from '../../hooks'
import i18n from '../../utils/i18n'
import CustomFeeItem from './components/networkFees/CustomFeeItem'
import EstimatedFeeItem from './components/networkFees/EstimatedFeeItem'
import { useNetworkFeesSetup } from './hooks/useNetworkFeesSetup'
import { updateSettings } from '../../utils/account'

const customFeeRules = {
  required: true,
  feeRate: true,
}

const estimatedFeeRates: FeeRate[] = ['fastestFee', 'halfHourFee', 'hourFee', 'custom']

export default (): ReactElement => {
  const { estimatedFees } = useNetworkFeesSetup()
  const [selectedFeeRate, setSelectedFeeRate] = useState<FeeRate>('fastestFee')
  const [customFeeRate, setCustomFeeRate, isValid] = useValidatedState<string>('1', customFeeRules)

  const options = estimatedFeeRates.map((feeRate) => ({
    value: feeRate,
    display:
      feeRate === 'custom' ? (
        <CustomFeeItem {...{ customFeeRate, setCustomFeeRate, disabled: selectedFeeRate !== 'custom' }} />
      ) : (
        <EstimatedFeeItem {...{ feeRate, estimatedFees: estimatedFees[feeRate] }} />
      ),
  }))

  useEffect(() => {
    updateSettings({
      selectedFeeRate,
    })
  }, [selectedFeeRate])

  useEffect(() => {
    updateSettings({
      customFeeRate: Number(customFeeRate),
    })
  }, [customFeeRate])

  return (
    <View style={tw`flex-1`}>
      <PeachScrollView contentContainerStyle={tw`flex-1 justify-center p-8`}>
        <RadioButtons
          {...{
            items: options,
            selectedValue: selectedFeeRate,
            onChange: setSelectedFeeRate,
          }}
        />
        <HorizontalLine style={tw`mt-8 bg-black-5`} />
        <Text style={tw`text-center text-black-2 mt-4`}>{i18n('settings.networkFees.averageFees')}</Text>
        <Text style={tw`subtitle-1 text-center`}>
          {i18n('settings.networkFees.xSatsPerByte', estimatedFees.economyFee.toString())}
        </Text>
      </PeachScrollView>
      <GoBackButton style={tw`m-8 self-center`} />
    </View>
  )
}
