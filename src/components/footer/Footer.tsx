
import React, { ReactElement, useContext, useEffect, useState } from 'react'
import {
  // Image,
  Pressable,
  View
} from 'react-native'
import messaging from '@react-native-firebase/messaging'

import { Shadow, Text } from '..'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { footerShadow } from '../../utils/layout'
import Icon from '../Icon'
// import BG from './bg.svg'
import { NavigationContainerRefWithCurrent } from '@react-navigation/native'
import { Bubble } from '../ui'
import { getChatNotifications } from '../../utils/chat'
import AppContext from '../../contexts/app'
import { saveContract } from '../../utils/contract'
import { getContract } from '../../utils/peachAPI'
import { IconType } from '../icons'
import keyboard from '../../effects/keyboard'

type FooterProps = ComponentProps & {
  active: keyof RootStackParamList,
  setCurrentPage: React.Dispatch<React.SetStateAction<keyof RootStackParamList>>,
  navigation: NavigationContainerRefWithCurrent<RootStackParamList>,
}
type FooterItemProps = ComponentProps & {
  id: IconType,
  active: boolean,
  onPress: () => void,
  notifications?: number
}

const height = 52
// const circleStyle = {
//   width: 58,
//   height
// }

// eslint-disable-next-line max-len
const isSettings = /settings|contact|report|language|currency|backups|paymentMethods|deleteAccount|fees|socials|seedWords/u

/**
 * @description Component to display the Footer Item
 * @param props Component properties
 * @param props.id item id
 * @param props.active active menu item
 * @param props.onPress on press handler
 * @example
 * <FooterItem id="sell" active={true} />
 */
const FooterItem = ({ id, active, onPress, notifications = 0, style }: FooterItemProps): ReactElement => {
  const color = active ? tw`text-peach-1` : tw`text-grey-2`
  return <Pressable onPress={onPress} style={style}>
    <View style={[tw`flex items-center`, !active ? tw`opacity-30` : {}]}>
      <Icon id={id} style={tw`w-7 h-7`} color={color.color as string} />
      <Text style={[color, tw`font-baloo text-2xs leading-3 mt-1 text-center`]}>
        {i18n(id)}
      </Text>
    </View>
    {notifications
      ? <Bubble color={tw`text-green`.color as string}
        style={tw`absolute top-0 right-0 -m-2 w-4 flex justify-center items-center`}>
        <Text style={tw`text-xs font-baloo text-white-1 text-center mt-0.5`} ellipsizeMode="head" numberOfLines={1}>
          {notifications}
        </Text>
      </Bubble>
      : null
    }
  </Pressable>
}

/**
 * @description Component to display the Footer
 * @param props Component properties
 * @param props.active active menu item
 * @example
 * <Footer active={'home'} />
 */
export const Footer = ({ active, style, setCurrentPage, navigation }: FooterProps): ReactElement => {
  const [keyboardOpen, setKeyboardOpen] = useState(false)
  const [{ notifications }, updateAppContext] = useContext(AppContext)

  const navTo = (page: keyof RootStackParamList) => {
    setCurrentPage(page)
    navigation.navigate({ name: page, merge: false, params: {} })
  }
  const navigate = {
    home: () => navTo('home'),
    buy: () => navTo('buy'),
    sell: () => navTo('sell'),
    yourTrades: () => navTo('yourTrades'),
    settings: () => navTo('settings'),
  }

  useEffect(keyboard(setKeyboardOpen), [])

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      if (remoteMessage.data && remoteMessage.data.type === 'contract.chat') {
        updateAppContext({
          notifications: notifications + 1
        })
        const [contract] = await getContract({ contractId: remoteMessage.data.contractId })
        if (contract) {
          saveContract(contract)
        }
      }
    })

    updateAppContext({
      notifications: getChatNotifications()
    })

    return unsubscribe
  }, [])

  return !keyboardOpen
    ? <View style={[tw`w-full flex-row items-start`, { height }, style]}>
      <View style={tw`h-full flex-grow relative`}>
        <Shadow shadow={footerShadow} style={tw`w-full`}>
          <View style={tw`h-full flex-row items-center justify-between bg-white-2`}>
            <FooterItem
              id="buy" style={tw`w-1/4`}
              active={active === 'buy' || active === 'home'}
              onPress={navigate.buy}
            />
            <FooterItem
              id="sell" style={tw`w-1/4`}
              active={active === 'sell'}
              onPress={navigate.sell}
            />
            <FooterItem
              id="yourTrades" style={tw`w-1/4`}
              active={active === 'yourTrades' || /contract/u.test(active as string)}
              onPress={navigate.yourTrades}
              notifications={notifications}
            />
            <FooterItem
              id="settings" style={tw`w-1/4`}
              active={isSettings.test(active as string)}
              onPress={navigate.settings}
            />
          </View>
        </Shadow>
      </View>
    </View>
    : <View />
}

export default Footer


/* <Pressable style={[tw`h-full flex-shrink-0 flex items-center z-10`, circleStyle]}
  onPress={navigate.home})}>
  <BG style={[circleStyle, nativeShadow]} />
  <Image source={require('../../../assets/favico/peach-logo.png')} style={[
    tw`w-10 h-10 absolute -top-5`,
    active !== 'home' ? tw`opacity-30` : {}
  ]}/>
</Pressable>
<View style={tw`h-full flex-grow`}>
  <Shadow shadow={footerShadow} stule={tw`w-full`}>
    <View style={tw`h-full flex-row items-center justify-between px-7 bg-white-2`}>
      <FooterItem id="yourTrades" active={active === 'yourTrades'}
        onPress={navigate.yourTrades} />
      <FooterItem id="settings" active={active === 'settings'}
        onPress={navigate.settings} />
    </View>
  </Shadow>
</View> */