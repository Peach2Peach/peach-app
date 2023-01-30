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
import { PeachWSContext } from '../../utils/peachAPI/websocket'
import { IconType } from '../../assets/icons'
import { useSettingsStore } from '../../store/settingsStore'
import shallow from 'zustand/shallow'

import PeachOrange from '../../assets/logo/peachOrange.svg'
import PeachBorder from '../../assets/logo/peachBorder.svg'

type FooterProps = ComponentProps & {
  active: keyof RootStackParamList
  setCurrentPage: React.Dispatch<React.SetStateAction<keyof RootStackParamList | undefined>>
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
const isWallet = /wallet|transactionHistory|transactionDetails/u

const isBuy = /buy|buyPreferences|home/u

const isSell = /sell|sellPreferences/u

/**
 * @description Component to display the Footer Item
 * @example
 * <FooterItem id="sell" active={true} />
 */
const FooterItem = ({ id, active, onPress, notifications = 0, style }: FooterItemProps): ReactElement => {
  const color = active ? (id === 'settings' ? tw`text-primary-main` : tw`text-black-1`) : tw`text-black-5`
  return (
    <Pressable testID={`footer-${id}`} onPress={onPress} style={[style, tw`flex-row justify-center`]}>
      <View>
        <View style={tw`flex items-center`}>
          {id === 'settings' ? (
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
        {notifications ? (
          <View
            style={[
              tw`absolute w-5 h-5 -top-2 left-1/2 mt-.5 bg-info-light items-center justify-center`,
              tw`border-2 rounded-full border-primary-background`,
            ]}
          >
            <Text style={tw`body-s text-primary-background`}>{notifications}</Text>
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
export const Footer = ({ active, style, setCurrentPage }: FooterProps): ReactElement => {
  const navigation = useNavigation()
  const [{ notifications }, updateAppContext] = useContext(AppContext)
  const ws = useContext(PeachWSContext)

  const [peachWalletActive] = useSettingsStore((state) => [state.peachWalletActive], shallow)

  const keyboardOpen = useKeyboard()

  const navTo = (page: 'home' | 'buy' | 'sell' | 'wallet' | 'yourTrades' | 'settings') => {
    setCurrentPage(page)
    navigation.navigate(page)
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
    updateAppContext({
      notifications: getChatNotifications(),
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
        notifications: getChatNotifications(),
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
        notifications: getChatNotifications(),
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
    <View style={[tw`flex-row items-start w-full`, style]}>
      <View style={tw`relative flex-grow`}>
        <Shadow shadow={footerShadow} style={tw`w-full`}>
          <View style={tw`flex-row items-center justify-between px-5 py-4 bg-primary-background`}>
            <FooterItem id="buy" active={isBuy.test(active as string)} onPress={navigate.buy} />
            <FooterItem id="sell" active={isSell.test(active as string)} onPress={navigate.sell} />
            {peachWalletActive && <FooterItem id="wallet" active={isWallet.test(active)} onPress={navigate.wallet} />}
            <FooterItem
              id="yourTrades"
              active={active === 'yourTrades' || /contract/u.test(active)}
              onPress={navigate.yourTrades}
              notifications={notifications}
            />
            <FooterItem id="settings" active={isSettings.test(active)} onPress={navigate.settings} />
          </View>
        </Shadow>
      </View>
    </View>
  ) : (
    <View />
  )
}

export default Footer
