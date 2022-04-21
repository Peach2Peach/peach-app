import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { Text } from '../../../components'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'

type MatchDisclaimerProps = {
  matched: boolean
}

export const MatchDisclaimer = ({ matched }: MatchDisclaimerProps): ReactElement =>
  <View style={tw`mt-1 h-10`}>
    <Text style={tw`text-center text-xs leading-6`}>
      {matched ? i18n('search.matchAsManyAsYouWant.1') : ''}
    </Text>
    <Text style={tw`text-center text-xs leading-6`}>
      {matched ? i18n('search.matchAsManyAsYouWant.2') : ''}
    </Text>
  </View>

export default MatchDisclaimer