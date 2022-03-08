import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement, useContext } from 'react'
import { View } from 'react-native'

import { Button, Headline } from '../../../components'
import Icon from '../../../components/Icon'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { OverlayContext } from '../../../utils/overlay'

const TradeCanceled = () => <View style={tw`flex items-center`}>
  <Headline style={tw`text-center text-white-1 font-baloo text-3xl leading-3xl`}>
    {i18n('cancelTrade.confirm.success')}
  </Headline>
  <View style={tw`flex items-center justify-center w-16 h-16 bg-green rounded-full`}>
    <Icon id="check" style={tw`w-12 h-12`} color={tw`text-white-1`.color as string} />
  </View>
</View>


type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'home'>
type ConfirmCancelTradeProps = {
  confirm: () => Promise<void>,
  navigation: ProfileScreenNavigationProp,
}

export default ({ confirm, navigation }: ConfirmCancelTradeProps): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)

  const closeOverlay = () => updateOverlay({ content: null, showCloseButton: true })
  const ok = async () => {
    await confirm()
    updateOverlay({ content: <TradeCanceled />, showCloseButton: false })
    setTimeout(() => {
      closeOverlay()
      navigation.navigate('home', {})
    }, 3000)
  }
  return <View style={tw`flex items-center`}>
    <Headline style={tw`text-center text-white-1 font-baloo text-xl leading-8`}>
      {i18n('cancelTrade.confirm.title')}
    </Headline>
    <Button
      style={tw`mt-2`}
      title={i18n('cancelTrade.confirm.back')}
      secondary={true}
      wide={false}
      onPress={closeOverlay}
    />
    <Button
      style={tw`mt-2`}
      title={i18n('cancelTrade.confirm.ok')}
      tertiary={true}
      wide={false}
      onPress={ok}
    />
  </View>
}