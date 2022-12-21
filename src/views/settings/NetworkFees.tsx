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

const estimatedFeeRates: FeeRate[] = ['fastestFee', 'halfHourFee', 'economyFee', 'custom']
const dummyFees: Record<FeeRate, number> = {
  fastestFee: 12,
  halfHourFee: 5,
  economyFee: 2,
  custom: 1,
}

export default (): ReactElement => {
  useNetworkFeesSetup()
  const [estimatedFees, setEstimatedFees] = useState(dummyFees)
  const [selectedFeeRate, setSelectedFeeRate] = useState<FeeRate>('fastestFee')
  const [customFeeRate, setCustomFeeRate, , customFeeRateErrorMessage] = useValidatedState('1', customFeeRules)

  const options = estimatedFeeRates.map((feeRate) => ({
    value: feeRate,
    display:
      feeRate === 'custom' ? (
        <CustomFeeItem />
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
      customFeeRate,
    })
  }, [customFeeRate])

  return (
    <View style={tw`flex-1`}>
      <PeachScrollView contentContainerStyle={tw`flex-1 justify-center p-16`}>
        <Text style={tw`text-center text-black-2`}>{i18n('settings.networkFees.averageFees')}</Text>
        <Text style={tw`subtitle-1 text-center`}>
          {i18n('settings.networkFees.xSatsPerByte', estimatedFees.halfHourFee.toString())}
        </Text>
        <HorizontalLine style={tw`mt-4 bg-black-5`} />
        <RadioButtons
          style={tw`mt-8`}
          {...{
            items: options,
            selectedValue: selectedFeeRate,
            onChange: setSelectedFeeRate,
          }}
        />
        {selectedFeeRate === 'custom' && (
          <View style={tw`flex items-center`}>
            <View style={tw`absolute h-10 flex flex-row justify-center mt-3`}>
              <Input
                style={tw`w-16`}
                {...{
                  value: customFeeRate,
                  onChange: setCustomFeeRate,
                  required: true,
                  errorMessage: customFeeRateErrorMessage,
                }}
              />
              <View style={tw`h-10 flex justify-center pl-2`}>
                <Text style={tw`subtitle-1`}>{i18n('satsPerByte')}</Text>
              </View>
            </View>
          </View>
        )}
      </PeachScrollView>
      <GoBackButton style={tw`m-8 self-center`} />
    </View>
  )
}
