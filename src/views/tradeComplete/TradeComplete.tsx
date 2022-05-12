import React, { ReactElement, useEffect } from 'react'
import {
  View
} from 'react-native'
import tw from '../../styles/tailwind'
import { StackNavigationProp } from '@react-navigation/stack'

import { RouteProp } from '@react-navigation/native'
import { BigTitle, Button } from '../../components'
import i18n from '../../utils/i18n'
import { getTradingLimit } from '../../utils/peachAPI'
import { updateTradingLimit } from '../../utils/account'

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'tradeComplete'>

type Props = {
  route: RouteProp<{ params: {
    view: 'buyer' | 'seller',
  } }>,
  navigation: ProfileScreenNavigationProp,
}
export default ({ route, navigation }: Props): ReactElement => {
  useEffect(() => {
    (async () => {
      const [tradingLimit] = await getTradingLimit()

      if (tradingLimit) {
        updateTradingLimit(tradingLimit)
      }
    })()
  }, [])

  return <View style={tw`h-full flex pb-10 px-6`}>
    <View style={tw`h-full flex-shrink flex justify-center`}>
      <BigTitle title={i18n(`tradeComplete.title.${route.params.view}.default`)}/>
    </View>
    <View style={tw`flex items-center`}>
      <Button
        title={i18n('goBackHome')}
        secondary={true}
        wide={false}
        onPress={() => navigation.navigate('home', {})}
      />
    </View>
  </View>
}