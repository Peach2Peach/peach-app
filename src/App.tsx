import { useEffect, useReducer, useRef, useState } from 'react'

import { Animated, Dimensions, SafeAreaView } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import analytics from '@react-native-firebase/analytics'
import { DefaultTheme, NavigationContainer, NavigationState, useNavigationContainerRef } from '@react-navigation/native'
import { enableScreens } from 'react-native-screens'

import { AvoidKeyboard, Drawer, Message, Popup } from './components'
import tw from './styles/tailwind'
import i18n, { LanguageContext } from './utils/i18n'
import { getViews } from './views/getViews'

import { defaultState, DrawerContext, setDrawer } from './contexts/drawer'
import { getMessage, MessageContext, setMessage, showMessageEffect } from './contexts/message'
import { getWebSocket, PeachWSContext, setPeachWS } from './utils/peachAPI/websocket'

import { DEV } from '@env'
import { QueryClientProvider } from '@tanstack/react-query'
import { setUnhandledPromiseRejectionTracker } from 'react-native-promise-rejection-utils'
import { Background } from './components/background/Background'
import { ISEMULATOR } from './constants'
import { GlobalHandlers } from './GlobalHandlers'
import { initApp } from './init/initApp'
import { requestUserPermissions } from './init/requestUserPermissions'
import { initWebSocket } from './init/websocket'
import { queryClient } from './queryClient'
import { usePartialAppSetup } from './usePartialAppSetup'
import { account } from './utils/account'
import { error, info } from './utils/log'
import { parseError } from './utils/result'
import { isNetworkError } from './utils/system'
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
  const [messageState, updateMessage] = useReducer(setMessage, getMessage())
  const languageReducer = useReducer(i18n.setLocale, i18n.getState())
  const drawerReducer = useReducer(setDrawer, defaultState)
  const [peachWS, updatePeachWS] = useReducer(setPeachWS, getWebSocket())
  const { width } = Dimensions.get('window')
  const slideInAnim = useRef(new Animated.Value(-width)).current
  const navigationRef = useNavigationContainerRef()

  const [currentPage, setCurrentPage] = useState<keyof RootStackParamList>()
  const views = getViews(!!account?.publicKey)
  const showFooter = !!views.find((v) => v.name === currentPage)?.showFooter
  const backgroundConfig = views.find((v) => v.name === currentPage)?.background

  ErrorUtils.setGlobalHandler((err: Error) => {
    error(err)
    updateMessage({
      msgKey: err.message || 'GENERAL_ERROR',
      level: 'ERROR',
      action: {
        callback: () => navigationRef.navigate('contact'),
        label: i18n('contactUs'),
        icon: 'mail',
      },
    })
  })

  setUnhandledPromiseRejectionTracker((id, err) => {
    error(err)
    const errorMessage = parseError(err)
    const msgKey = isNetworkError(errorMessage) ? 'NETWORK_ERROR' : errorMessage
    updateMessage({
      msgKey: msgKey || 'GENERAL_ERROR',
      level: 'ERROR',
      action: {
        callback: () => navigationRef.navigate('contact'),
        label: i18n('contactUs'),
        icon: 'mail',
      },
    })
  })

  useEffect(showMessageEffect(messageState.msgKey, width, slideInAnim), [messageState.msgKey, messageState.time])

  useEffect(() => {
    if (DEV !== 'true' && ISEMULATOR) {
      error(new Error('NO_EMULATOR'))
      updateMessage({ msgKey: 'NO_EMULATOR', level: 'ERROR' })

      return
    }

    (async () => {
      const statusResponse = await initApp()
      if (!statusResponse || statusResponse.error) {
        updateMessage({
          msgKey: statusResponse?.error || 'NETWORK_ERROR',
          level: 'ERROR',
          action: {
            callback: () => navigationRef.navigate('contact'),
            label: i18n('contactUs'),
            icon: 'mail',
          },
        })
      }
      setCurrentPage(account?.publicKey ? 'home' : 'welcome')
      requestUserPermissions()
    })()
  }, [])

  useEffect(initWebSocket(updatePeachWS, updateMessage), [])
  usePartialAppSetup()

  useEffect(() => {
    analytics().logAppOpen()
  }, [])

  const onNavStateChange = (state: NavigationState | undefined) => {
    if (state) setCurrentPage(state.routes[state.routes.length - 1].name as keyof RootStackParamList)
  }

  useEffect(() => {
    info('Navigation event', currentPage)
    // Disable OS back button
    analytics().logScreenView({
      screen_name: currentPage,
    })
  }, [currentPage])

  if (!currentPage) return null

  return (
    <GestureHandlerRootView>
      <AvoidKeyboard>
        <QueryClientProvider client={queryClient}>
          <LanguageContext.Provider value={languageReducer}>
            <PeachWSContext.Provider value={peachWS}>
              <MessageContext.Provider value={[messageState, updateMessage]}>
                <DrawerContext.Provider value={drawerReducer}>
                  <NavigationContainer theme={navTheme} ref={navigationRef} onStateChange={onNavStateChange}>
                    <GlobalHandlers {...{ currentPage }} />
                    <Background config={backgroundConfig}>
                      <Drawer />
                      <Popup />

                      {!!messageState.msgKey && (
                        <Animated.View style={[tw`absolute z-20 w-full`, { top: slideInAnim }]}>
                          <SafeAreaView>
                            <Message {...messageState} />
                          </SafeAreaView>
                        </Animated.View>
                      )}
                      <Screens />
                    </Background>
                  </NavigationContainer>
                </DrawerContext.Provider>
              </MessageContext.Provider>
            </PeachWSContext.Provider>
          </LanguageContext.Provider>
        </QueryClientProvider>
      </AvoidKeyboard>
    </GestureHandlerRootView>
  )
}
