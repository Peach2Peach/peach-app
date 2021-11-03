
import React, { ReactElement } from 'react'
import {
  Image,
  View, ViewStyle
} from 'react-native'

import { Text } from '..'
import { Shadow } from 'react-native-shadow-2'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { footerShadow } from '../../utils/layoutUtils'
import Icon from '../Icon'
import BG from './bg.svg'
import peachLogo from '../../../assets/favico/peach-logo.png'

interface FooterProps {
  active: string,
  style?: ViewStyle|ViewStyle[]
}
interface FooterItemProps {
  id: string,
  active: boolean,
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
 * @example
 * <FooterItem id="sell" active={true} />
 */
const FooterItem = ({ id, active }: FooterItemProps): ReactElement =>
  <View style={[
    tw`flex items-center`,
    !active ? tw`opacity-30` : {}
  ]}>
    <Icon id={id} style={tw`w-7 h-7`} />
    <Text style={tw`text-peach-1 font-baloo text-2xs leading-3 mt-1`}>
      {i18n(id)}
    </Text>
  </View>

/**
 * @description Component to display the Footer
 * @param props Component properties
 * @param props.active active menu item
 * @example
 * <Footer active={'home'} />
 */
export const Footer = ({ active, style }: FooterProps): ReactElement => 
  <View style={[tw`w-full flex-row items-start`, { height }, style]}>
    <View style={tw`h-full flex-grow relative`}>
      <Shadow {...footerShadow} viewStyle={tw`w-full`}>
        <View style={tw`h-full flex-row items-center justify-between px-7 bg-white-2`}>
          <FooterItem id="buy" active={active === 'buy'} />
          <FooterItem id="sell" active={active === 'sell'} />
        </View>
      </Shadow>
    </View>
    <View style={[tw`h-full flex-shrink-0 flex items-center z-10`, circleStyle]}>
      <BG style={circleStyle} />
      <Image source={peachLogo} style={[
        tw`w-10 h-10 absolute -top-5`,
        active !== 'home' ? tw`opacity-30` : {}
      ]}/>
    </View>
    <View style={tw`h-full flex-grow`}>
      <Shadow {...footerShadow} viewStyle={tw`w-full`}>
        <View style={tw`h-full flex-row items-center justify-between px-7 bg-white-2`}>
          <FooterItem id="offers" active={active === 'offers'} />
          <FooterItem id="settings" active={active === 'settings'} />
        </View>
      </Shadow>
    </View>
  </View>

export default Footer