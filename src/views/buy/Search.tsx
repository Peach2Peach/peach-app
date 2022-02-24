import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

import LanguageContext from '../../components/inputs/LanguageSelect'
import { BigTitle, Matches } from '../../components'
import i18n from '../../utils/i18n'
import { BuyViewProps } from './Buy'
import searchForPeersEffect from '../../effects/searchForPeersEffect'

export default ({ offer, setStepValid }: BuyViewProps): ReactElement => {
  useContext(LanguageContext)

  const [matches, setMatches] = useState<Match[]>([])
  useEffect(searchForPeersEffect({
    offer,
    onSuccess: result => {
      setMatches(() => result)
    },
    onError: () => {
      // TODO treat API Error case (404, 500, etc)
    },
  }), [offer.id])

  useEffect(() => setStepValid(true))

  return <View style={tw`h-full flex justify-center`}>
    <BigTitle title={i18n('searchingForAPeer')} />
    <Matches matches={matches} />
  </View>
}