import analytics from '@react-native-firebase/analytics'
import { DefaultTheme, NavigationContainer, NavigationState } from '@react-navigation/native'
import { useEffect, useReducer } from 'react'
import { enableScreens } from 'react-native-screens'

import { getWebSocket, PeachWSContext, setPeachWS } from './utils/peachAPI/websocket'

import { QueryClientProvider } from '@tanstack/react-query'
import { atom, useAtom } from 'jotai'
import { Modal, View } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { useDeviceContext } from 'twrnc'
import { Drawer } from './components/drawer/Drawer'
import { Message } from './components/message/Message'
import { useMessageState } from './components/message/useMessageState'
import { PeachyBackground } from './components/PeachyBackground'
import { Popup } from './components/popup/Popup'
import { initWebSocket } from './init/websocket'
import { queryClient } from './queryClient'
import tw from './styles/tailwind'
import { usePartialAppSetup } from './usePartialAppSetup'
import { info } from './utils/log'
import { Screens } from './views/Screens'

enableScreens()

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
  },
}

export const App = () => {
  useDeviceContext(tw)
  const [peachWS, updatePeachWS] = useReducer(setPeachWS, getWebSocket())

  const updateMessage = useMessageState((state) => state.updateMessage)
  useEffect(initWebSocket(updatePeachWS, updateMessage), [])
  usePartialAppSetup()

  useEffect(() => {
    analytics().logAppOpen()
  }, [])

  const onNavStateChange = (state?: NavigationState) => {
    const newPage = state?.routes[state.routes.length - 1].name
    info('Navigation event', newPage)
    analytics().logScreenView({
      screen_name: newPage,
    })
  }

  return (
    <QueryClientProvider client={queryClient}>
      <PeachWSContext.Provider value={peachWS}>
        <SafeAreaProvider>
          <NavigationContainer theme={navTheme} onStateChange={onNavStateChange}>
            <Screens />
            <Drawer />
            <Popup />
            <Overlay />
            <Message />
          </NavigationContainer>
        </SafeAreaProvider>
      </PeachWSContext.Provider>
    </QueryClientProvider>
  )
}

export const overlayAtom = atom<React.ReactNode>(undefined)
function Overlay () {
  const [content] = useAtom(overlayAtom)
  return (
    <Modal visible={content !== undefined}>
      <PeachyBackground />
      <View style={[tw`flex-1 p-sm`, tw`md:p-md`]}>{content}</View>
    </Modal>
  )
}
