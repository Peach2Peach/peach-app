import tw from '../../styles/tailwind'

import { Header, HorizontalLine, PeachScrollView, RadioButtons, Screen, Text } from '../../components'
import { Button } from '../../components/buttons/Button'
import { useShowHelp } from '../../hooks'
import i18n from '../../utils/i18n'
import { headerIcons } from '../../utils/layout'
import { CustomFeeItem } from './components/networkFees/CustomFeeItem'
import { EstimatedFeeItem } from './components/networkFees/EstimatedFeeItem'
import { useNetworkFeesSetup } from './hooks/useNetworkFeesSetup'

const estimatedFeeRates: FeeRate[] = ['fastestFee', 'halfHourFee', 'hourFee', 'custom']

export const NetworkFees = () => {
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
    <Screen header={<NetworkFeesHeader />}>
      <PeachScrollView contentContainerStyle={tw`justify-center flex-1`}>
        <RadioButtons items={options} selectedValue={selectedFeeRate} onButtonPress={setSelectedFeeRate} />
        <HorizontalLine style={tw`mt-8`} />
        <Text style={tw`mt-4 text-center text-black-2`}>{i18n('settings.networkFees.averageFees')}</Text>
        <Text style={tw`text-center subtitle-1`}>
          {i18n('settings.networkFees.xSatsPerByte', estimatedFees.economyFee.toString())}
        </Text>
      </PeachScrollView>
      <Button onPress={submit} disabled={!isValid || feeRateSet} style={tw`self-center min-w-52`}>
        {i18n(feeRateSet ? 'settings.networkFees.feeRateSet' : 'confirm')}
      </Button>
    </Screen>
  )
}

function NetworkFeesHeader () {
  const showHelp = useShowHelp('networkFees')
  return <Header title={i18n('settings.networkFees')} icons={[{ ...headerIcons.help, onPress: showHelp }]} />
}
