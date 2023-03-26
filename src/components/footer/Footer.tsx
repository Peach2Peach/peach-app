import { ReactElement, useContext, useEffect } from 'react';
import * as React from 'react';
import { Pressable, View } from 'react-native'

import { Icon, Text } from '..'
import { IconType } from '../../assets/icons'
import { useKeyboard, useNavigation } from '../../hooks'
import tw from '../../styles/tailwind'
import { account } from '../../utils/account'
import { getContract as getContractFromDevice, saveContract } from '../../utils/contract'
import i18n from '../../utils/i18n'
import { PeachWSContext } from '../../utils/peachAPI/websocket'

import PeachBorder from '../../assets/logo/peachBorder.svg'
import PeachOrange from '../../assets/logo/peachOrange.svg'
import { useNotificationStore } from './notificationsStore'

type FooterProps = ComponentProps & {
  active: keyof RootStackParamList
  setCurrentPage: React.Dispatch<React.SetStateAction<keyof RootStackParamList | undefined>>
  theme?: 'default' | 'inverted'
}
type FooterItemProps = ComponentProps & {
  id: IconType
  active: boolean
  onPress: () => void
  theme?: 'default' | 'inverted'
  notifications?: number
}

// eslint-disable-next-line max-len
const isSettings
  = /settings|contact|report|language|currency|backup|paymentMethods|deleteAccount|fees|socials|seedWords/u
const isWallet = /wallet|transactionHistory|transactionDetails/u

const isBuy = /buy|buyPreferences|home/u

const isSell = /sell|sellPreferences/u

const themes = {
  default: {
    text: tw`text-black-2`,
    textSelected: tw`text-black-1`,
    textSelectedSettings: tw`text-primary-main`,
    bg: tw`bg-primary-background`,
  },
  inverted: {
    text: tw`text-primary-mild-2`,
    textSelected: tw`text-primary-background-light`,
    textSelectedSettings: tw`text-primary-background-light`,
    bg: tw`bg-transparent`,
  },
}

/**
 * @description Component to display the Footer Item
 * @example
 * <FooterItem id="sell" active={true} />
 */
const FooterItem = ({
  id,
  active,
  onPress,
  notifications = 0,
  theme = 'default',
  style,
}: FooterItemProps): ReactElement => {
  const colors = themes[theme || 'default']
  const color = active ? (id === 'settings' ? colors.textSelectedSettings : colors.textSelected) : colors.text
  return (
    <Pressable testID={`footer-${id}`} onPress={onPress} style={[style, tw`flex-row justify-center`]}>
      <View>
        <View style={tw`flex items-center`}>
          {id === 'settings' && theme === 'default' ? (
            active ? (
              <PeachOrange style={tw`w-6 h-6`} />
            ) : (
              <PeachBorder style={tw`w-6 h-6`} />
            )
          ) : (
            <Icon id={id} style={tw`w-6 h-6`} color={color.color} />
          )}
          <Text style={[color, tw`leading-relaxed text-center subtitle-1 text-3xs`]}>{i18n(`footer.${id}`)}</Text>
        </View>
        {theme === 'default' && notifications ? (
          <View
            style={[
              tw`absolute w-20px h-20px -top-2 left-1/2 bg-primary-main`,
              tw`border-2 rounded-full border-primary-background`,
            ]}
          >
            <Text
              numberOfLines={1}
              style={[
                tw`self-center body-s text-primary-background text-14px leading-20px`,
                notifications > 9 && tw`text-12px leading-18px`,
              ]}
            >
              {Math.min(99, notifications)}
            </Text>
          </View>
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
export const Footer = ({ active, style, setCurrentPage, theme = 'default' }: FooterProps): ReactElement => {
  const navigation = useNavigation()
  const ws = useContext(PeachWSContext)
  const colors = themes[theme || 'default']

  const notifications = useNotificationStore((state) => state.notifications)

  const keyboardOpen = useKeyboard()

  const navTo = (page: 'home' | 'buy' | 'sell' | 'wallet' | 'yourTrades' | 'settings') => {
    setCurrentPage(page)
    navigation.reset({
      index: 0,
      routes: [{ name: page }],
    })
  }
  const navigate = {
    home: () => navTo('home'),
    buy: () => navTo('buy'),
    sell: () => navTo('sell'),
    wallet: () => navTo('wallet'),
    yourTrades: () => navTo('yourTrades'),
    settings: () => navTo('settings'),
  }

  useEffect(() => {
    const contractUpdateHandler = async (update: ContractUpdate) => {
      const contract = getContractFromDevice(update.contractId)

      if (!contract) return
      saveContract({
        ...contract,
        [update.event]: new Date(update.data.date),
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
    }
    const unsubscribe = () => {
      ws.off('message', contractUpdateHandler)
      ws.off('message', messageHandler)
    }

    if (!ws.connected) return unsubscribe

    ws.on('message', contractUpdateHandler)
    ws.on('message', messageHandler)

    return unsubscribe
  }, [ws, ws.connected])

  return !keyboardOpen ? (
    <View style={[tw`flex-row items-start w-full`, style]}>
      <View style={tw`relative flex-grow`}>
        <View style={[tw`flex-row items-center justify-between px-5 py-4`, colors.bg]}>
          <FooterItem theme={theme} id="buy" active={isBuy.test(active as string)} onPress={navigate.buy} />
          <FooterItem theme={theme} id="sell" active={isSell.test(active as string)} onPress={navigate.sell} />
          <FooterItem theme={theme} id="wallet" active={isWallet.test(active)} onPress={navigate.wallet} />
          <FooterItem
            theme={theme}
            id="yourTrades"
            active={active === 'yourTrades' || /contract/u.test(active)}
            onPress={navigate.yourTrades}
            notifications={notifications}
          />
          <FooterItem theme={theme} id="settings" active={isSettings.test(active)} onPress={navigate.settings} />
        </View>
      </View>
    </View>
  ) : (
    <View />
  );
}

export default Footer
