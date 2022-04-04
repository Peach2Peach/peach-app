
import React, { ReactElement } from 'react'
import {
  Image,
  Pressable,
  View, ViewStyle
} from 'react-native'

import { Text } from '..'
import { Shadow } from 'react-native-shadow-2'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { footerShadow, nativeShadow } from '../../utils/layout'
import Icon from '../Icon'
import BG from './bg.svg'
import { NavigationContainerRefWithCurrent } from '@react-navigation/native'

interface FooterProps {
  active: string,
  navigation: NavigationContainerRefWithCurrent<RootStackParamList>,
  style?: ViewStyle|ViewStyle[]
}
interface FooterItemProps {
  id: string,
  active: boolean,
  onPress: () => void
}

const height = 52
const circleStyle = {
  width: 58,
  height
}

/**
 * @description Component to display the Footer Item
 * @param props Component properties
 * @param props.id item id
 * @param props.active active menu item
 * @param props.onPress on press handler
 * @example
 * <FooterItem id="sell" active={true} />
 */
const FooterItem = ({ id, active, onPress }: FooterItemProps): ReactElement =>
  <Pressable
    style={[
      tw`flex items-center`,
      !active ? tw`opacity-30` : {}
    ]}
    onPress={onPress}>
    <Icon id={id} style={tw`w-7 h-7`} color={tw`text-peach-1`.color as string} />
    <Text style={tw`text-peach-1 font-baloo text-2xs leading-3 mt-1`}>
      {i18n(id)}
    </Text>
  </Pressable>

/**
 * @description Component to display the Footer
 * @param props Component properties
 * @param props.active active menu item
 * @example
 * <Footer active={'home'} />
 */
export const Footer = ({ active, style, navigation }: FooterProps): ReactElement =>
  <View style={[tw`w-full flex-row items-start`, { height }, style]}>
    <View style={tw`h-full flex-grow relative`}>
      <Shadow {...footerShadow} viewStyle={tw`w-full`}>
        <View style={tw`h-full flex-row items-center justify-between px-11 bg-white-2`}>
          <FooterItem id="buy" active={active === 'buy' || active === 'home'}
            onPress={() => navigation.navigate({ name: 'buy', merge: false, params: {} })} />
          <FooterItem id="sell" active={active === 'sell'}
            onPress={() => navigation.navigate({ name: 'sell', merge: false, params: {} })} />
          <FooterItem id="offers" active={active === 'offers'}
            onPress={() => navigation.navigate({ name: 'offers', merge: false, params: {} })} />
          <FooterItem id="settings" active={active === 'settings'}
            onPress={() => navigation.navigate({ name: 'settings', merge: false, params: {} })} />
        </View>
      </Shadow>
    </View>
  </View>

export default Footer


/* <Pressable style={[tw`h-full flex-shrink-0 flex items-center z-10`, circleStyle]}
  onPress={() => navigation.navigate({ name: 'home', merge: false, params: {} })}>
  <BG style={[circleStyle, nativeShadow]} />
  <Image source={require('../../../assets/favico/peach-logo.png')} style={[
    tw`w-10 h-10 absolute -top-5`,
    active !== 'home' ? tw`opacity-30` : {}
  ]}/>
</Pressable>
<View style={tw`h-full flex-grow`}>
  <Shadow {...footerShadow} viewStyle={tw`w-full`}>
    <View style={tw`h-full flex-row items-center justify-between px-7 bg-white-2`}>
      <FooterItem id="offers" active={active === 'offers'}
        onPress={() => navigation.navigate({ name: 'offers', merge: false, params: {} })} />
      <FooterItem id="settings" active={active === 'settings'}
        onPress={() => navigation.navigate({ name: 'settings', merge: false, params: {} })} />
    </View>
  </Shadow>
</View> */