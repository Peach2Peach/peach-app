import { useMemo, useState } from 'react'
import { Divider, Header, PeachScrollView, Screen } from '../../components'
import { Button } from '../../components/buttons/Button'
import { useRoute, useShowHelp } from '../../hooks'
import { useFeeEstimate } from '../../hooks/query/useFeeEstimate'
import { useTransactionDetails } from '../../hooks/query/useTransactionDetails'
import tw from '../../styles/tailwind'
import { getTransactionFeeRate } from '../../utils/bitcoin'
import i18n from '../../utils/i18n'
import { headerIcons } from '../../utils/layout'
import { getErrorsInField } from '../../utils/validation'
import { useWalletState } from '../../utils/wallet/walletStore'
import { BitcoinLoading } from '../loading/BitcoinLoading'
import { CurrentFee } from './components/bumpNetworkFees/CurrentFee'
import { FeeEstimates } from './components/bumpNetworkFees/FeeEstimates'
import { NewFee } from './components/bumpNetworkFees/NewFee'
import { useBumpFees } from './hooks/useBumpFees'

const MIN_EXTRA_FEE_RATE = 1.01
export const BumpNetworkFees = () => {
  const { txId } = useRoute<'bumpNetworkFees'>().params

  const localTransaction = useWalletState((state) => state.getTransaction(txId))
  const { transaction } = useTransactionDetails({ txId })
  const { estimatedFees } = useFeeEstimate()
  const currentFeeRate = transaction ? getTransactionFeeRate(transaction) : 1
  const [feeRate, setNewFeeRate] = useState<string>()
  const newFeeRate = feeRate ?? (currentFeeRate + MIN_EXTRA_FEE_RATE).toFixed(2)

  const newFeeRateRules = useMemo(() => ({ min: currentFeeRate + 1, required: true, feeRate: true }), [currentFeeRate])
  const newFeeRateErrors = useMemo(() => getErrorsInField(newFeeRate, newFeeRateRules), [newFeeRate, newFeeRateRules])
  const newFeeRateIsValid = newFeeRate && newFeeRateErrors.length === 0
  const overpayingBy = Number(newFeeRate) / estimatedFees.fastestFee - 1
  const sendingAmount = localTransaction ? localTransaction.sent - localTransaction.received : 0

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
      <BumpNetworkFeesButton {...{ transaction, newFeeRate, sendingAmount }} disabled={!newFeeRateIsValid} />
    </Screen>
  )
}

function BumpNetworkFeesHeader () {
  const showHelp = useShowHelp('rbf')
  return <Header title={i18n('wallet.bumpNetworkFees.title')} icons={[{ ...headerIcons.help, onPress: showHelp }]} />
}

type Props = {
  transaction?: Transaction | null
  newFeeRate: string
  sendingAmount: number
  disabled?: boolean
}
function BumpNetworkFeesButton ({ transaction, newFeeRate, sendingAmount, disabled }: Props) {
  const bumpFees = useBumpFees({ transaction, newFeeRate: Number(newFeeRate), sendingAmount })

  return (
    <Button style={tw`self-center`} disabled={disabled} onPress={bumpFees}>
      {i18n('confirm')}
    </Button>
  )
}
