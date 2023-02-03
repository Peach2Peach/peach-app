import React, { ReactElement, useContext, useEffect } from 'react'
import { Pressable, View } from 'react-native'

import { Text } from '..'
import AppContext from '../../contexts/app'
import { useKeyboard } from '../../hooks'
import tw from '../../styles/tailwind'
import { account } from '../../utils/account'
import { getChatNotifications } from '../../utils/chat'
import { getContract as getContractFromDevice, saveContract } from '../../utils/contract'
import i18n from '../../utils/i18n'
import { Navigation } from '../../utils/navigation'
import { getRequiredActionCount } from '../../utils/offer'
import { PeachWSContext } from '../../utils/peachAPI/websocket'
import Icon from '../Icon'
import { IconType } from '../icons'
import { Bubble } from '../ui'

type FooterProps = ComponentProps & {
  active: keyof RootStackParamList
  setCurrentPage: React.Dispatch<React.SetStateAction<keyof RootStackParamList>>
  navigation: Navigation
}
type FooterItemProps = ComponentProps & {
  id: IconType
  active: boolean
  onPress: () => void
  notifications?: number
}

const height = 52

// eslint-disable-next-line max-len
const isSettings
  = /settings|contact|report|language|currency|backups|paymentMethods|deleteAccount|fees|socials|seedWords/u

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
  return (
    <Pressable testID={`footer-${id}`} onPress={onPress} style={[style, tw`flex-row justify-center`]}>
      <View>
        <View style={[tw`flex items-center`, !active ? tw`opacity-30` : {}]}>
          <Icon id={id} style={tw`w-7 h-7`} color={color.color as string} />
          <Text style={[color, tw`font-baloo text-2xs leading-3 mt-1 text-center`]}>{i18n(id)}</Text>
        </View>
        {notifications ? (
          <Bubble
            color={tw`text-green`.color as string}
            style={tw`absolute top-0 right-0 -m-2 w-4 flex justify-center items-center`}
          >
            <Text style={tw`text-xs font-baloo text-white-1 text-center mt-0.5`} ellipsizeMode="head" numberOfLines={1}>
              {notifications}
            </Text>
          </Bubble>
        ) : null}
      </View>
    </Pressable>
  )
}

/**
 * @description Component to display the Footer
 * @param props Component properties
 * @param props.active active menu item
 * @example
 * <Footer active={'home'} />
 */
export const Footer = ({ active, style, setCurrentPage, navigation }: FooterProps): ReactElement => {
  const [{ notifications }, updateAppContext] = useContext(AppContext)
  const ws = useContext(PeachWSContext)

  const keyboardOpen = useKeyboard()

  const navTo = (page: keyof RootStackParamList) => {
    setCurrentPage(page)
    navigation.navigate(page as string, {})
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
  }, [])

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
  }, [ws.connected])

  return !keyboardOpen ? (
    <View style={[tw`w-full flex-row items-start`, { height }, style]}>
      <View style={tw`h-full flex-grow relative`}>
        <View style={tw`w-full h-full flex-row items-center justify-between bg-white-2`}>
          <FooterItem id="buy" style={tw`w-1/4`} active={active === 'buy' || active === 'home'} onPress={navigate.buy} />
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
      </View>
    </View>
  ) : (
    <View />
  )
}

export default Footer
