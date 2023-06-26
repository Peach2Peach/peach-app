import { View } from 'react-native'
import { Divider, PeachScrollView, PrimaryButton, Text } from '../../components'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { BitcoinLoading } from '../loading/BitcoinLoading'
import { CurrentFee } from './components/bumpNetworkFees/CurrentFee'
import { FeeEstimates } from './components/bumpNetworkFees/FeeEstimates'
import { NewFee } from './components/bumpNetworkFees/NewFee'
import { useBumpNetworkFeesSetup } from './hooks/useBumpNetworkFeesSetup'
import { round } from '../../utils/math'

export const BumpNetworkFees = () => {
  const {
    transaction,
    currentFeeRate,
    newFeeRate,
    setNewFeeRate,
    newFeeRateIsValid,
    estimatedFees,
    overpayingBy,
    bumpFees,
  } = useBumpNetworkFeesSetup()

  if (!transaction) return <BitcoinLoading />

  return (
    <View style={tw`items-center justify-between h-full gap-4 pb-5`}>
      <PeachScrollView style={tw`h-full`} contentContainerStyle={[tw`justify-center flex-1 px-7`, tw.md`px-10`]}>
        <View style={tw`gap-5`}>
          <CurrentFee fee={currentFeeRate} />
          <Divider />
          <FeeEstimates {...{ estimatedFees, setFeeRate: setNewFeeRate, isOverpaying: overpayingBy >= 1 }} />
          <Divider />
          <NewFee {...{ newFeeRate, setNewFeeRate }} />
          <Text style={tw`text-error-main text-center`}>
            {overpayingBy >= 1 ? i18n('wallet.bumpNetworkFees.overPayingBy', String(round(overpayingBy * 100))) : ' '}
          </Text>
        </View>
      </PeachScrollView>
      <PrimaryButton disabled={!newFeeRateIsValid} onPress={bumpFees}>
        {i18n('confirm')}
      </PrimaryButton>
    </View>
  )
}
