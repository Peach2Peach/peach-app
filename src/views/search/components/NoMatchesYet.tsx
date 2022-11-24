import React from 'react'
import { View } from 'react-native'
import { BigTitle, Loading, Text } from '../../../components'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { useOfferMatches } from '../hooks/useOfferMatches'

export default () => {
  const { isLoading } = useOfferMatches()
  return (
    <>
      <BigTitle title={i18n('search.searchingForAPeer')} />
      {isLoading ? (
        <View style={tw`h-12`}>
          <Loading />
          <Text style={tw`text-center`}>{i18n('loading')}</Text>
        </View>
      ) : (
        <Text style={tw`text-center mt-3`}>{i18n('search.weWillNotifyYou')}</Text>
      )}
    </>
  )
}
