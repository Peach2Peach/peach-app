import { Dispatch, SetStateAction, useEffect } from 'react'
import { useNavigation } from '../../../hooks'
import { useLanguageContext } from '../../../utils/i18n'
import { useWebsocketContext } from '../../../utils/peachAPI/websocket'
import { contractUpdateHandler } from '../eventHandlers/contractUpdateHandler'
import { messageHandler } from '../eventHandlers/messageHandler'
import { useNotificationStore } from '../notificationsStore'

export type MainPage = 'home' | 'buy' | 'sell' | 'wallet' | 'yourTrades' | 'settings'
export type Props = ComponentProps & {
  setCurrentPage: Dispatch<SetStateAction<keyof RootStackParamList | undefined>>
}
export const useFooterSetup = ({ setCurrentPage }: Props) => {
  useLanguageContext()
  const navigation = useNavigation()
  const ws = useWebsocketContext()

  const notifications = useNotificationStore((state) => state.notifications)

  const navTo = (page: MainPage) => {
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
    const unsubscribe = () => {
      ws.off('message', contractUpdateHandler)
      ws.off('message', messageHandler)
    }

    if (!ws.connected) return unsubscribe

    ws.on('message', contractUpdateHandler)
    ws.on('message', messageHandler)

    return unsubscribe
  }, [ws, ws.connected])

  return { navigate, notifications, navTo }
}
