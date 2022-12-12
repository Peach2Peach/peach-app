import React, { ReactElement, useContext, useEffect } from 'react'
import { Pressable, View } from 'react-native'

import { Icon, Shadow, Text } from '..'
import AppContext from '../../contexts/app'
import { useKeyboard, useNavigation } from '../../hooks'
import tw from '../../styles/tailwind'
import { account } from '../../utils/account'
import { getChatNotifications } from '../../utils/chat'
import { getContract as getContractFromDevice, saveContract } from '../../utils/contract'
import i18n from '../../utils/i18n'
import { footerShadow } from '../../utils/layout'
import { getRequiredActionCount } from '../../utils/offer'
import { PeachWSContext } from '../../utils/peachAPI/websocket'
import { IconType } from '../icons'

type FooterProps = ComponentProps & {
  active: keyof RootStackParamList
  setCurrentPage: React.Dispatch<React.SetStateAction<keyof RootStackParamList>>
}
type FooterItemProps = ComponentProps & {
  id: IconType
  active: boolean
  onPress: () => void
  notifications?: number
}

// eslint-disable-next-line max-len
const isSettings
  = /settings|contact|report|language|currency|backups|paymentMethods|deleteAccount|fees|socials|seedWords/u

/**
 * @description Component to display the Footer Item
 * @example
 * <FooterItem id="sell" active={true} />
 */
const FooterItem = ({ id, active, onPress, notifications = 0, style }: FooterItemProps): ReactElement => {
  const color = active ? tw`text-black-1` : tw`text-black-5`
  return (
    <Pressable testID={`footer-${id}`} onPress={onPress} style={[style, tw`flex-row justify-center`]}>
      <View>
        <View style={tw`flex items-center`}>
          <Icon id={id} style={tw`w-6 h-6`} color={color.color} />
          <Text style={[color, tw`subtitle-1 text-3xs leading-relaxed text-center`]}>{i18n(id)}</Text>
        </View>
        {notifications ? (
          <Icon
            id="notification"
            style={tw`w-5 h-5 absolute -top-2 left-1/2 mt-.5`}
            color={tw`text-success-light`.color}
          />
        ) : null}
      </View>
    </Pressable>
  )
}

/**
 * @description Component to display the Footer
 * @example
 * <Footer active={'home'} />
 */
export const Footer = ({ active, style, setCurrentPage }: FooterProps): ReactElement => {
  const navigation = useNavigation()
  const [{ notifications }, updateAppContext] = useContext(AppContext)
  const ws = useContext(PeachWSContext)

  const keyboardOpen = useKeyboard()

  const navTo = (page: 'home' | 'buy' | 'sell' | 'yourTrades' | 'settings') => {
    setCurrentPage(page)
    navigation.navigate(page)
  }
  const navigate = {
    home: () => navTo('home'),
    buy: () => navTo('buy'),
    sell: () => navTo('sell'),
    yourTrades: () => navTo('yourTrades'),
    settings: () => navTo('settings'),
  }

  useEffect(() => {
    updateAppContext({
      notifications: getChatNotifications() + getRequiredActionCount(),
    })
  }, [updateAppContext])

  useEffect(() => {
    const contractUpdateHandler = async (update: ContractUpdate) => {
      const contract = getContractFromDevice(update.contractId)

      if (!contract) return
      saveContract({
        ...contract,
        [update.event]: new Date(update.data.date),
      })
      updateAppContext({
        notifications: getChatNotifications() + getRequiredActionCount(),
      })
    }
    const messageHandler = async (message: Message) => {
      if (!message.message || !message.roomId || message.from === account.publicKey) return
      const contract = getContractFromDevice(message.roomId.replace('contract-', ''))
      if (!contract) return

      saveContract({
        ...contract,
        unreadMessages: contract.unreadMessages + 1,
      })
      updateAppContext({
        notifications: getChatNotifications() + getRequiredActionCount(),
      })
    }
    const unsubscribe = () => {
      ws.off('message', contractUpdateHandler)
      ws.off('message', messageHandler)
    }

    if (!ws.connected) return unsubscribe

    ws.on('message', contractUpdateHandler)
    ws.on('message', messageHandler)

    return unsubscribe
  }, [updateAppContext, ws, ws.connected])

  return !keyboardOpen ? (
    <View style={[tw`w-full flex-row items-start`, style]}>
      <View style={tw`flex-grow relative`}>
        <Shadow shadow={footerShadow} style={tw`w-full`}>
          <View style={tw`flex-row items-center justify-between bg-primary-background py-4`}>
            <FooterItem
              id="buy"
              style={tw`w-1/4`}
              active={active === 'buy' || active === 'home'}
              onPress={navigate.buy}
            />
            <FooterItem id="sell" style={tw`w-1/4`} active={active === 'sell'} onPress={navigate.sell} />
            <FooterItem
              id="yourTrades"
              style={tw`w-1/4`}
              active={active === 'yourTrades' || /contract/u.test(active as string)}
              onPress={navigate.yourTrades}
              notifications={notifications}
            />
            <FooterItem
              id="settings"
              style={tw`w-1/4`}
              active={isSettings.test(active as string)}
              onPress={navigate.settings}
            />
          </View>
        </Shadow>
      </View>
    </View>
  ) : (
    <View />
  )
}

export default Footer
