import analytics from '@react-native-firebase/analytics'
import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { LayoutChangeEvent, Pressable, TouchableOpacity, View } from 'react-native'
import RNRestart from 'react-native-restart'

import { Icon, Shadow, Text } from '..'
import { TIMETORESTART } from '../../constants'
import AppContext from '../../contexts/app'
import BitcoinContext from '../../contexts/bitcoin'
import appStateEffect from '../../effects/appStateEffect'
import { getPeachInfo, getTrades } from '../../init/session'
import tw from '../../styles/tailwind'
import { account, getAccount } from '../../utils/account'
import { getChatNotifications } from '../../utils/chat'
import i18n from '../../utils/i18n'
import { mildShadow } from '../../utils/layout'
import { Navigation } from '../../utils/navigation'
import { getRequiredActionCount } from '../../utils/offer'
import { marketPrices } from '../../utils/peachAPI/public/market'
import { thousands } from '../../utils/string'
import { Fade } from '../animation'
import Logo from '../../assets/logo/peachLogo.svg'
import { useNavigation, useRoute } from '@react-navigation/native'
import { StackHeaderProps } from '@react-navigation/stack'
import { useHeaderState } from './store'

let HEADERHEIGHT = 56
const setHeaderHeight = (event: LayoutChangeEvent) => (HEADERHEIGHT = event.nativeEvent.layout.height)
export const getHeaderHeight = () => HEADERHEIGHT

let goHomeTimeout: NodeJS.Timer

type HeaderProps = ComponentProps & {
  navigation: Navigation
}

/**
 * @description Component to display the Header
 * @example <Header navigation={navigation} />
 */
export const OldHeader = ({ style, navigation }: HeaderProps): ReactElement => {
  const [bitcoinContext, updateBitcoinContext] = useContext(BitcoinContext)
  const [, updateAppContext] = useContext(AppContext)
  const [active, setActive] = useState(true)

  useEffect(() => {
    analytics().logAppOpen()
  }, [])

  useEffect(
    appStateEffect({
      callback: (isActive) => {
        setActive(isActive)
        if (isActive) {
          getPeachInfo(getAccount())
          getTrades()
          updateAppContext({
            notifications: getChatNotifications() + getRequiredActionCount(),
          })
          analytics().logAppOpen()

          clearTimeout(goHomeTimeout)
        } else {
          goHomeTimeout = setTimeout(() => RNRestart.Restart(), TIMETORESTART)
        }
      },
    }),
    [],
  )

  useEffect(() => {
    if (!active) return () => {}

    const checkingInterval = 15 * 1000
    const checkingFunction = async () => {
      const [prices] = await marketPrices({ timeout: checkingInterval })
      if (prices) updateBitcoinContext({ prices })
    }
    const interval = setInterval(checkingFunction, checkingInterval)
    updateBitcoinContext({ currency: account.settings.displayCurrency })
    checkingFunction()

    return () => {
      clearInterval(interval)
    }
  }, [active])

  const goToMyAccount = () => navigation.navigate('profile', { userId: account.publicKey })

  return (
    <View style={style} onLayout={setHeaderHeight}>
      <Shadow shadow={mildShadow}>
        <View style={tw`w-full flex-row items-center justify-between px-4 py-2 bg-white-1`}>
          <Fade show={!!bitcoinContext.price} style={tw`w-1/2`} displayNone={false}>
            <Text style={tw`font-lato leading-5 text-grey-1`}>1 Bitcoin</Text>
            <Text style={tw`font-lato leading-5 text-peach-1`}>
              {i18n(`currency.format.${bitcoinContext.currency}`, thousands(Math.round(bitcoinContext.price)))}
            </Text>
          </Fade>
          <Pressable onPress={goToMyAccount} style={tw`absolute w-10 left-1/2 -ml-2`}>
            <Logo style={tw`w-12 h-12`} />
          </Pressable>
          <Fade show={!!bitcoinContext.price} style={tw`w-1/2`} displayNone={false}>
            <Text style={tw`font-lato leading-5 text-grey-1 text-right`}>1 {bitcoinContext.currency}</Text>
            <Text style={tw`font-lato leading-5 text-peach-1 text-right`}>
              {i18n('currency.format.sats', thousands(Math.round(bitcoinContext.satsPerUnit)))}
            </Text>
          </Fade>
        </View>
      </Shadow>
    </View>
  )
}

export const Header = () => {
  const { title, icons, titleComponent, showGoBackButton } = useHeaderState()

  const { goBack, canGoBack } = useNavigation()
  const handleBackPress = canGoBack() ? goBack : () => undefined

  return (
    <View style={tw`flex-row h-9 bg-primary-background justify-between mx-4 px-8`}>
      <View style={tw`items-center flex-row`}>
        {showGoBackButton && (
          <TouchableOpacity style={tw`w-6 h-6 -ml-[10px] mr-2`} onPress={handleBackPress}>
            <Icon id="chevronLeft" />
          </TouchableOpacity>
        )}
        {title ? <Text style={tw`h6`}>{title}</Text> : titleComponent}
      </View>

      <View style={tw`items-center flex-row`}>
        {icons.map(({ iconId, onPress }) => (
          <TouchableOpacity style={tw`w-6 h-6 mx-2`} onPress={onPress}>
            <Icon id={iconId} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}
