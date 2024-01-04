import { View } from 'react-native'
import tw from '../../../styles/tailwind'

import { PeachText } from '../../../components/text/PeachText'
import i18n from '../../../utils/i18n'

const pointsRepresentation: Record<RewardType, string> = {
  customReferralCode: '100',
  noPeachFees: '200',
  sats: '> 300',
}
type Props = {
  reward: Reward
}
export const RewardItem = ({ reward }: Props) => (
  <View style={tw`flex-row items-center justify-between py-1`}>
    <PeachText style={tw`subtitle-1`}>{i18n(`referrals.reward.${reward.id}`)}</PeachText>
    <PeachText style={tw`mr-2 body-m text-black-2`}>({pointsRepresentation[reward.id]})</PeachText>
  </View>
)
