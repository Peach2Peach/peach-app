import analytics from '@react-native-firebase/analytics'
import React, { useContext, useEffect, useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import RNRestart from 'react-native-restart'

import { Icon, Text } from '..'
import { TIMETORESTART } from '../../constants'
import AppContext from '../../contexts/app'
import BitcoinContext from '../../contexts/bitcoin'
import appStateEffect from '../../effects/appStateEffect'
import { getPeachInfo, getTrades } from '../../init/session'
import tw from '../../styles/tailwind'
import { account, getAccount } from '../../utils/account'
import { getChatNotifications } from '../../utils/chat'
import { getRequiredActionCount } from '../../utils/offer'
import { marketPrices } from '../../utils/peachAPI/public/market'
import { useNavigation } from '@react-navigation/native'
import { useHeaderState } from './store'

let goHomeTimeout: NodeJS.Timer

const useHeaderEffect = () => {
  const [, updateBitcoinContext] = useContext(BitcoinContext)
  const [, updateAppContext] = useContext(AppContext)
  const [active, setActive] = useState(true)

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
}

export const Header = () => {
  const { title, icons, titleComponent, showGoBackButton } = useHeaderState()
  useHeaderEffect()
  const { goBack, canGoBack } = useNavigation()
  const handleBackPress = canGoBack() ? goBack : () => undefined

  return (
    <View style={tw`flex-row h-9 justify-between mx-4 px-8`}>
      <View style={tw`items-center flex-row`}>
        {showGoBackButton && (
          <TouchableOpacity style={tw`w-6 h-6 -ml-[10px] mr-2`} onPress={handleBackPress}>
            <Icon id="chevronLeft" />
          </TouchableOpacity>
        )}
        {title ? <Text style={tw`h6`}>{title}</Text> : titleComponent}
      </View>

      <View style={tw`items-center flex-row`}>
        {icons?.map(({ iconComponent, onPress }) => (
          <TouchableOpacity style={tw`w-6 h-6 mx-2`} onPress={onPress}>
            {iconComponent}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}
