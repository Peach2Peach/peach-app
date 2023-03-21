import React from 'react'
import { View } from 'react-native'
import tw from '../../../styles/tailwind'

import { Text } from '../../../components'
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
    <Text style={tw`subtitle-1`}>{i18n(`referrals.reward.${reward.id}`)}</Text>
    <Text style={tw`mr-2 body-m text-black-2`}>({pointsRepresentation[reward.id]})</Text>
  </View>
)
