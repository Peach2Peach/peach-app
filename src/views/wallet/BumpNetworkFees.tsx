import { Divider, Header, PeachScrollView, Screen } from '../../components'
import { useShowHelp } from '../../hooks'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { headerIcons } from '../../utils/layout'
import { BitcoinLoading } from '../loading/BitcoinLoading'
import { BumpNetworkFeesButton } from './components/BumpNetworkFeesButton'
import { CurrentFee } from './components/bumpNetworkFees/CurrentFee'
import { FeeEstimates } from './components/bumpNetworkFees/FeeEstimates'
import { NewFee } from './components/bumpNetworkFees/NewFee'
import { useBumpNetworkFeesSetup } from './hooks/useBumpNetworkFeesSetup'

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

  if (!transaction) return <BitcoinLoading />

  return (
    <Screen header={<BumpNetworkFeesHeader />}>
      <PeachScrollView
        style={tw`flex-1 w-full h-full`}
        contentContainerStyle={tw`justify-center flex-1`}
        contentStyle={[tw`gap-3`, tw.md`gap-5`]}
      >
        <CurrentFee fee={currentFeeRate} />
        <Divider />
        <FeeEstimates {...{ estimatedFees, setFeeRate: setNewFeeRate, isOverpaying: overpayingBy >= 1 }} />
        <Divider />
        <NewFee {...{ newFeeRate, setNewFeeRate, overpayingBy }} />
      </PeachScrollView>
      <BumpNetworkFeesButton
        style={tw`self-center`}
        {...{ transaction, newFeeRate, sendingAmount }}
        disabled={!newFeeRateIsValid}
      />
    </Screen>
  )
}

function BumpNetworkFeesHeader () {
  const showHelp = useShowHelp('rbf')
  return <Header title={i18n('wallet.bumpNetworkFees.title')} icons={[{ ...headerIcons.help, onPress: showHelp }]} />
}
