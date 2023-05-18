import { View } from 'react-native'

import tw from '../../styles/tailwind'

import { HorizontalLine, PeachScrollView, PrimaryButton, RadioButtons, Text } from '../../components'
import i18n from '../../utils/i18n'
import { CustomFeeItem } from './components/networkFees/CustomFeeItem'
import EstimatedFeeItem from './components/networkFees/EstimatedFeeItem'
import { useNetworkFeesSetup } from './hooks/useNetworkFeesSetup'

const estimatedFeeRates: FeeRate[] = ['fastestFee', 'halfHourFee', 'hourFee', 'custom']

export default () => {
  const {
    estimatedFees,
    selectedFeeRate,
    setSelectedFeeRate,
    customFeeRate,
    setCustomFeeRate,
    submit,
    isValid,
    feeRateSet,
  } = useNetworkFeesSetup()

  const options = estimatedFeeRates.map((rate) => ({
    value: rate,
    display:
      rate === 'custom' ? (
        <CustomFeeItem {...{ customFeeRate, setCustomFeeRate, disabled: selectedFeeRate !== 'custom' }} />
      ) : (
        <EstimatedFeeItem {...{ feeRate: rate, estimatedFees: estimatedFees[rate] }} />
      ),
  }))

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
