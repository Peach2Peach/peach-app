import { View } from 'react-native'
import { RadioButtonItem } from '../../../components/inputs/RadioButtons'
import { PeachText } from '../../../components/text/PeachText'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { REWARDINFO } from '../constants'
import { isRewardAvailable } from './isRewardAvailable'

export const mapRewardsToRadioButtonItems = (balance: number): RadioButtonItem<RewardType>[] =>
  REWARDINFO.map((reward) => ({
    value: reward.id,
    disabled: !isRewardAvailable(reward, balance),
    display: <RewardItem reward={reward} />,
  }))

const pointsRepresentation: Record<RewardType, string> = {
  customReferralCode: '100',
  noPeachFees: '200',
  sats: '> 300',
}
type Props = {
  reward: Reward
}

function RewardItem ({ reward }: Props) {
  return (
    <View style={tw`flex-row items-center justify-between py-1`}>
      <PeachText style={tw`subtitle-1`}>{i18n(`referrals.reward.${reward.id}`)}</PeachText>
      <PeachText style={tw`text-black-65`}>({pointsRepresentation[reward.id]})</PeachText>
    </View>
  )
}
