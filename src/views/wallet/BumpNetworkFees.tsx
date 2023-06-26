import { View } from 'react-native'
import { Divider, PeachScrollView, PrimaryButton } from '../../components'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { BitcoinLoading } from '../loading/BitcoinLoading'
import { CurrentFee } from './components/bumpNetworkFees/CurrentFee'
import { FeeEstimates } from './components/bumpNetworkFees/FeeEstimates'
import { NewFee } from './components/bumpNetworkFees/NewFee'
import { useBumpNetworkFeesSetup } from './hooks/useBumpNetworkFeesSetup'
import { useBumpFees } from './hooks/useBumpFees'

export const BumpNetworkFees = () => {
  const {
    transaction,
    currentFeeRate,
    newFeeRate,
    setNewFeeRate,
    newFeeRateIsValid,
    estimatedFees,
    sendingAmount,
    overpayingBy,
  } = useBumpNetworkFeesSetup()
  const bumpFees = useBumpFees({ transaction, newFeeRate: Number(newFeeRate), sendingAmount })

  if (!transaction) return <BitcoinLoading />

  return (
    <View style={tw`items-center justify-between h-full gap-4 pb-5`}>
      <PeachScrollView
        style={tw`h-full w-full`}
        contentContainerStyle={[tw`justify-center flex-1 px-8`, tw.md`px-10`]}
        contentStyle={[tw`gap-3`, tw.md`gap-5`]}
      >
        <CurrentFee fee={currentFeeRate} />
        <Divider />
        <FeeEstimates {...{ estimatedFees, setFeeRate: setNewFeeRate, isOverpaying: overpayingBy >= 1 }} />
        <Divider />
        <NewFee {...{ newFeeRate, setNewFeeRate, overpayingBy }} />
      </PeachScrollView>
      <PrimaryButton disabled={!newFeeRateIsValid} onPress={bumpFees} narrow>
        {i18n('confirm')}
      </PrimaryButton>
    </View>
  )
}
