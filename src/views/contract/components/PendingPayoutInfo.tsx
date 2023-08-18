import { View } from 'react-native'
import { Divider } from '../../../components'
import { AddressSummaryItem, AmountSummaryItem, TextSummaryItem } from '../../../components/summaryItem'
import { useShowHelp } from '../../../hooks'
import tw from '../../../styles/tailwind'
import { toTimeFormat } from '../../../utils/date'
import i18n from '../../../utils/i18n'
import { useContractContext } from '../context'
import { TogglePayoutPending } from './TogglePayoutPending'

const getETA = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const minutesLeft = minutes - hours * 60
  return toTimeFormat(hours, minutesLeft)
}
export const PendingPayoutInfo = () => {
  const { amount, releaseAddress, batchInfo } = useContractContext().contract
  const showHelp = useShowHelp('payoutPending')

  if (!batchInfo) return <></>
  const timeRemaining = batchInfo.timeRemaining === -2 ? i18n('batching.eta.tba') : getETA(batchInfo.timeRemaining)
  return (
    <View style={tw`gap-4 justify-center`}>
      <Divider text={i18n('offer.requiredAction.payoutPending')} />
      <AmountSummaryItem amount={amount} />
      <AddressSummaryItem title={i18n('batching.willBeSenTTo')} address={releaseAddress} />
      <TextSummaryItem
        title={i18n('batching.eta')}
        text={timeRemaining}
        iconId="helpCircle"
        iconColor={tw`text-info-main`.color}
        onPress={showHelp}
      />
      <TextSummaryItem title={i18n('batching.slots')} text={`${batchInfo.participants}/${batchInfo.maxParticipants}`} />
      <View style={tw`flex-row flex-wrap justify-start gap-2 mt-6px`}>
        <TogglePayoutPending />
      </View>
    </View>
  )
}
