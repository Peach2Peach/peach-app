import React from 'react'
import { View } from 'react-native'
import tw from '../../../styles/tailwind'

import { Text } from '../../../components'
import i18n from '../../../utils/i18n'

type Props = {
  reward: Reward
  cost: string
}
export const RewardItem = ({ reward, cost }: Props) => (
  <View style={tw`flex-row items-center justify-between py-1`}>
    <Text style={tw`subtitle-1`}>{i18n(`referrals.reward.${reward}`)}</Text>
    <Text style={tw`mr-2 body-m text-black-2`}>({cost})</Text>
  </View>
)
