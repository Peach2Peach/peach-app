import { useEffect, useReducer } from 'react'

import analytics from '@react-native-firebase/analytics'
import { DefaultTheme, NavigationContainer, NavigationState } from '@react-navigation/native'
import { enableScreens } from 'react-native-screens'

import { AvoidKeyboard, Drawer, Message, Popup } from './components'
import i18n, { LanguageContext } from './utils/i18n'

import { getWebSocket, PeachWSContext, setPeachWS } from './utils/peachAPI/websocket'

import { QueryClientProvider } from '@tanstack/react-query'
import { Background } from './components/background/Background'
import { useMessageState } from './components/message/useMessageState'
import { GlobalHandlers } from './GlobalHandlers'
import { initWebSocket } from './init/websocket'
import { queryClient } from './queryClient'
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
  const languageReducer = useReducer(i18n.setLocale, i18n.getState())
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
    <AvoidKeyboard>
      <QueryClientProvider client={queryClient}>
        <LanguageContext.Provider value={languageReducer}>
          <PeachWSContext.Provider value={peachWS}>
            <NavigationContainer theme={navTheme} onStateChange={onNavStateChange}>
              <GlobalHandlers />
              <Background>
                <Drawer />
                <Popup />

                <Message />
                <Screens />
              </Background>
            </NavigationContainer>
          </PeachWSContext.Provider>
        </LanguageContext.Provider>
      </QueryClientProvider>
    </AvoidKeyboard>
  )
}
