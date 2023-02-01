import React from 'react'
import { View } from 'react-native'
import { Loading, Text } from '../../../components'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { useOfferMatches } from '../hooks/useOfferMatches'

export const NoMatchesYet = () => {
  const { isLoading } = useOfferMatches()
  return (
    <View style={tw`flex-grow`}>
      <Text style={tw`h4 text-center`}>{i18n('search.searchingForAPeer')}</Text>
      {isLoading ? (
        <View style={tw`h-12 items-center`}>
          <Loading />
          <Text style={tw`text-center`}>{i18n('loading')}</Text>
        </View>
      ) : (
        <Text style={tw`mt-3 text-center`}>{i18n('search.weWillNotifyYou')}</Text>
      )}
    </View>
  )
}
