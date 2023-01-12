import React from 'react'
import { Pressable, View } from 'react-native'

import { useNavigation } from '../../../hooks'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { interpolate } from '../../../utils/math'
import { isSellOffer } from '../../../utils/offer'
import { Text } from '../../text'
import { ExtraMedals, Rating } from '../../user'
import { useMatchStore } from '../store'

type UserInfoProps = {
  user: Match['user']
}

export const UserInfo = ({ user }: UserInfoProps) => {
  const navigation = useNavigation()
  const offer = useMatchStore((state) => state.offer)
  const rawRating = user.ratingCount === 0 && user.medals.includes('ambassador') ? 0.2 : user.rating
  const userRating = Math.round(interpolate(rawRating, [-1, 1], [0, 5]) * 10) / 10

  return (
    <Pressable
      onPress={() => navigation.navigate('publicProfile', { userId: user.id, user })}
      style={tw`flex-row items-center justify-between w-full`}
    >
      <View>
        <Text style={tw`text-base`}>
          <Text style={tw`text-base font-bold`}>{i18n(isSellOffer(offer) ? 'buyer' : 'seller')}:</Text>
          <Text style={tw`text-base`}> Peach{user.id.substring(0, 8)}</Text>
        </Text>
        {user.trades < 3 ? (
          <Text style={tw`mt-2 ml-1 text-sm font-bold leading-4 font-baloo text-grey-2`}>{i18n('rating.newUser')}</Text>
        ) : (
          <View style={tw`flex-row items-center`}>
            <Rating rating={rawRating} style={tw`h-4`} />
            <Text style={tw`mt-2 ml-1 text-sm font-bold leading-4 font-baloo text-grey-2`}>{userRating} / 5</Text>
          </View>
        )}
      </View>
      <ExtraMedals user={user} />
    </Pressable>
  )
}
