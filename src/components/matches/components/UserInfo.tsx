import React from 'react'
import { Pressable, View } from 'react-native'
import { useNavigation, useRoute } from '../../../hooks'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { interpolate } from '../../../utils/math'
import { Text } from '../../text'
import { Rating, ExtraMedals } from '../../user'

type UserInfoProps = {
  match: Match
}

export const UserInfo = ({ match }: UserInfoProps) => {
  const navigation = useNavigation()
  const { offer } = useRoute<'search'>().params
  const rawRating = match.user.ratingCount === 0 && match.user.medals.includes('ambassador') ? 0.2 : match.user.rating
  const userRating = Math.round(interpolate(rawRating, [-1, 1], [0, 5]) * 10) / 10

  return (
    <Pressable
      onPress={() => navigation.navigate('profile', { userId: match.user.id, user: match.user })}
      style={tw`w-full flex-row justify-between items-center`}
    >
      <View>
        <Text style={tw`text-base`}>
          <Text style={tw`font-bold text-base`}>{i18n(offer.type === 'ask' ? 'buyer' : 'seller')}:</Text>
          <Text style={tw`text-base`}> Peach{match.user.id.substring(0, 8)}</Text>
        </Text>
        {match.user.trades < 3 ? (
          <Text style={tw`font-bold font-baloo text-sm leading-4 ml-1 mt-2 text-grey-2`}>{i18n('rating.newUser')}</Text>
        ) : (
          <View style={tw`flex-row items-center`}>
            <Rating rating={rawRating} style={tw`h-4`} />
            <Text style={tw`font-bold font-baloo text-sm leading-4 ml-1 mt-2 text-grey-2`}>{userRating} / 5</Text>
          </View>
        )}
      </View>
      <ExtraMedals user={match.user} />
    </Pressable>
  )
}
