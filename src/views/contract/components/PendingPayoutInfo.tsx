import { View } from 'react-native'
import { useSetPopup } from '../../../components/popup/Popup'
import { AddressSummaryItem, TextSummaryItem, TimerSummaryItem } from '../../../components/summaryItem'
import { MSINASECOND } from '../../../constants'
import { HelpPopup } from '../../../hooks/HelpPopup'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { useContractContext } from '../context'

const NO_ENTRY_VALUE = -2

export const PendingPayoutInfo = () => {
  const { releaseAddress, batchInfo } = useContractContext().contract
  const setPopup = useSetPopup()
  const showHelp = () => setPopup(<HelpPopup id="payoutPending" />)
  const etaProps = {
    title: i18n('batching.eta'),
    iconId: 'helpCircle' as const,
    iconColor: tw.color('info-main'),
    onPress: showHelp,
  }
  if (!batchInfo) return <></>
  const { timeRemaining, participants, maxParticipants } = batchInfo
  return (
    <View style={tw`justify-center gap-4 grow`}>
      <AddressSummaryItem title={i18n('batching.willBeSentTo')} address={releaseAddress} />
      {timeRemaining === NO_ENTRY_VALUE ? (
        <TextSummaryItem text={i18n('batching.eta.tba')} {...etaProps} />
      ) : (
        <TimerSummaryItem {...etaProps} end={Date.now() + timeRemaining * MSINASECOND} />
      )}
      <TextSummaryItem title={i18n('batching.slots')} text={`${participants}/${maxParticipants}`} />
    </View>
  )
}
