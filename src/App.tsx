/* eslint-disable max-lines */
import React, { ReactElement, useEffect, useReducer, useRef, useState } from 'react'
import { Animated, Dimensions, SafeAreaView, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import analytics from '@react-native-firebase/analytics'
import {
  DefaultTheme,
  NavigationContainer,
  NavigationContainerRefWithCurrent,
  NavigationState,
  useNavigationContainerRef,
} from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import RNRestart from 'react-native-restart'
import { enableScreens } from 'react-native-screens'

import { AvoidKeyboard, Footer, Header } from './components'
import tw from './styles/tailwind'
import i18n from './utils/i18n'
import { getViews } from './views'

import AppContext, { getAppContext, setAppContext } from './contexts/app'
import { DrawerContext, getDrawer, setDrawer } from './contexts/drawer'
import LanguageContext from './contexts/language'
import { getMessage, MessageContext, setMessage, showMessageEffect } from './contexts/message'
import { defaultOverlay, OverlayContext, useOverlay } from './contexts/overlay'
import { getWebSocket, PeachWSContext, setPeachWS } from './utils/peachAPI/websocket'

import Drawer from './components/Drawer'
import Message from './components/Message'
import Overlay from './components/Overlay'

import { DEV } from '@env'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { setUnhandledPromiseRejectionTracker } from 'react-native-promise-rejection-utils'
import shallow from 'zustand/shallow'
import { Background } from './components/background/Background'
import { APPVERSION, ISEMULATOR, LATESTAPPVERSION, MINAPPVERSION, TIMETORESTART } from './constants'
import appStateEffect from './effects/appStateEffect'
import { useHandleNotifications } from './hooks/useHandleNotifications'
import { getPeachInfo } from './init/getPeachInfo'
import { getTrades } from './init/getTrades'
import { initApp } from './init/initApp'
import { initialNavigation } from './init/initialNavigation'
import websocket from './init/websocket'
import { showAnalyticsPrompt } from './overlays/showAnalyticsPrompt'
import { useBitcoinStore } from './store/bitcoinStore'
import { account, getAccount } from './utils/account'
import { error, info } from './utils/log'
import { marketPrices } from './utils/peachAPI/public/market'
import { compatibilityCheck, linkToAppStore } from './utils/system'
import { useCheckTradeNotifications } from './hooks/useCheckTradeNotifications'

enableScreens()

const Stack = createStackNavigator<RootStackParamList>()

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
  },
}

const queryClient = new QueryClient()

let goHomeTimeout: NodeJS.Timer

type HandlerProps = {
  getCurrentPage: () => keyof RootStackParamList | undefined
}
const Handlers = ({ getCurrentPage }: HandlerProps): ReactElement => {
  useHandleNotifications(getCurrentPage)

  return <></>
}
const usePartialAppSetup = () => {
  const [active, setActive] = useState(true)
  const [setPrices, setCurrency] = useBitcoinStore((state) => [state.setPrices, state.setCurrency], shallow)
  const checkTradeNotifications = useCheckTradeNotifications()

  useEffect(
    appStateEffect({
      callback: (isActive) => {
        setActive(isActive)
        if (isActive) {
          getPeachInfo(getAccount())
          if (account?.publicKey) {
            getTrades()
            checkTradeNotifications()
          }
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
      if (prices) setPrices(prices)
    }
    const interval = setInterval(checkingFunction, checkingInterval)
    setCurrency(account.settings.displayCurrency)
    checkingFunction()

    return () => {
      clearInterval(interval)
    }
  }, [active, setCurrency, setPrices])
}

// eslint-disable-next-line max-statements
const App: React.FC = () => {
  const [appContext, updateAppContext] = useReducer(setAppContext, getAppContext())

  const [messageState, updateMessage] = useReducer(setMessage, getMessage())
  const [
    { title: drawerTitle, content: drawerContent, show: showDrawer, previousDrawer, onClose: onCloseDrawer },
    updateDrawer,
  ] = useReducer(setDrawer, getDrawer())
  const [overlayState, updateOverlay] = useOverlay()
  const [peachWS, updatePeachWS] = useReducer(setPeachWS, getWebSocket())
  const { width } = Dimensions.get('window')
  const slideInAnim = useRef(new Animated.Value(-width)).current
  const navigationRef = useNavigationContainerRef() as NavigationContainerRefWithCurrent<RootStackParamList>

  const [currentPage, setCurrentPage] = useState<keyof RootStackParamList>()
  const getCurrentPage = () => currentPage
  const views = getViews(!!account?.publicKey)
  const showFooter = !!views.find((v) => v.name === currentPage)?.showFooter
  const backgroundConfig = views.find((v) => v.name === currentPage)?.background

  const checkTradeNotifications = useCheckTradeNotifications()

  ErrorUtils.setGlobalHandler((err: Error) => {
    error(err)
    updateMessage({
      msgKey: (err as Error).message || 'GENERAL_ERROR',
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
    updateMessage({
      msgKey: (err as Error).message || 'GENERAL_ERROR',
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

    ;(async () => {
      await initApp()
      checkTradeNotifications()
      setCurrentPage(!!account?.publicKey ? 'home' : 'welcome')
      await initialNavigation(navigationRef, updateMessage)

      checkTradeNotifications()
      if (typeof account.settings.enableAnalytics === 'undefined') {
        showAnalyticsPrompt(updateOverlay)
      }

      if (!compatibilityCheck(APPVERSION, MINAPPVERSION)) {
        updateMessage({
          msgKey: 'CRITICAL_UPDATE_AVAILABLE',
          level: 'ERROR',
          keepAlive: true,
          action: {
            callback: linkToAppStore,
            label: i18n('download'),
            icon: 'download',
          },
        })
      } else if (!compatibilityCheck(APPVERSION, LATESTAPPVERSION)) {
        updateMessage({
          msgKey: 'UPDATE_AVAILABLE',
          level: 'WARN',
          keepAlive: true,
          action: {
            callback: linkToAppStore,
            label: i18n('download'),
            icon: 'download',
          },
        })
      }
    })()
  }, [])

  useEffect(websocket(updatePeachWS, updateMessage), [])
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
      screen_name: currentPage as string,
    })
  }, [currentPage])

  if (!currentPage) return null

  return (
    <GestureHandlerRootView>
      <AvoidKeyboard>
        <QueryClientProvider client={queryClient}>
          <LanguageContext.Provider value={{ locale: i18n.getLocale() }}>
            <PeachWSContext.Provider value={peachWS}>
              <AppContext.Provider value={[appContext, updateAppContext]}>
                <MessageContext.Provider value={[messageState, updateMessage]}>
                  <DrawerContext.Provider
                    value={[
                      { title: '', content: null, show: false, previousDrawer: {}, onClose: () => {} },
                      updateDrawer,
                    ]}
                  >
                    <OverlayContext.Provider value={[defaultOverlay, updateOverlay]}>
                      <NavigationContainer theme={navTheme} ref={navigationRef} onStateChange={onNavStateChange}>
                        <Handlers {...{ getCurrentPage }} />
                        <Background config={backgroundConfig}>
                          <Drawer
                            title={drawerTitle}
                            content={drawerContent}
                            show={showDrawer}
                            onClose={onCloseDrawer}
                            previousDrawer={previousDrawer}
                          />
                          <Overlay {...overlayState} />
                          <SafeAreaView>
                            <View style={tw`flex-col h-full`}>
                              {!!messageState.msgKey && (
                                <Animated.View style={[tw`absolute z-20 w-full`, { top: slideInAnim }]}>
                                  <Message {...messageState} />
                                </Animated.View>
                              )}
                              <View style={tw`flex-shrink h-full`}>
                                <Stack.Navigator
                                  detachInactiveScreens={true}
                                  screenOptions={{
                                    gestureEnabled: false,
                                    headerShown: false,
                                  }}
                                >
                                  {views.map(({ name, component, showHeader }) => (
                                    <Stack.Screen
                                      {...{ name, component }}
                                      key={name}
                                      options={{
                                        animationEnabled: false,
                                        headerShown: showHeader,
                                        header: () => <Header />,
                                      }}
                                    />
                                  ))}
                                </Stack.Navigator>
                              </View>
                              {showFooter && (
                                <Footer
                                  style={tw`z-10`}
                                  active={currentPage}
                                  setCurrentPage={setCurrentPage}
                                  theme={backgroundConfig?.color === 'primaryGradient' ? 'inverted' : 'default'}
                                />
                              )}
                            </View>
                          </SafeAreaView>
                        </Background>
                      </NavigationContainer>
                    </OverlayContext.Provider>
                  </DrawerContext.Provider>
                </MessageContext.Provider>
              </AppContext.Provider>
            </PeachWSContext.Provider>
          </LanguageContext.Provider>
        </QueryClientProvider>
      </AvoidKeyboard>
    </GestureHandlerRootView>
  )
}
export default App
