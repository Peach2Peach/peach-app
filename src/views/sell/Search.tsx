import React, { ReactElement, useContext, useEffect } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

import LanguageContext from '../../components/inputs/LanguageSelect'
import { Text } from '../../components'
import i18n from '../../utils/i18n'
import { SellViewProps } from './Sell'
import BigTitle from './components/BigTitle'
import searchForPeersEffect from './effects/searchForPeersEffect'

export default ({ offer, setStepValid }: SellViewProps): ReactElement => {
  useContext(LanguageContext)

  useEffect(searchForPeersEffect({
    offer,
    onSuccess: result => {
      // console.log('searchForPeers', result)
    },
    onError: () => {
      // TODO treat API Error case (404, 500, etc)
    },
  }), [offer.offerId])

  useEffect(() => setStepValid(true))

  return <View style={tw`h-full flex justify-center`}>
    <BigTitle title={i18n('sell.search.subtitle')} />
    <View style={tw`mt-6`}>
      <Text style={tw`text-center`}>
        {i18n('sell.search.description.1')}
      </Text>
      <Text style={tw`mt-2 text-center`}>
        {i18n('sell.search.description.2')}
      </Text>
    </View>
  </View>
}