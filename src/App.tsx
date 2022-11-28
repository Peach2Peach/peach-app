import React, { useEffect, useReducer, useRef, useState } from 'react'
import { Animated, Dimensions, SafeAreaView, StatusBar, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import analytics from '@react-native-firebase/analytics'
import {
  NavigationContainer,
  NavigationContainerRefWithCurrent,
  NavigationState,
  useNavigationContainerRef,
} from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { enableScreens } from 'react-native-screens'

import { AvoidKeyboard, Footer, Header } from './components'
import tw from './styles/tailwind'
import i18n from './utils/i18n'
import views from './views'

import AppContext, { getAppContext, setAppContext } from './contexts/app'
import BitcoinContext, { getBitcoinContext, setBitcoinContext } from './contexts/bitcoin'
import { DrawerContext, getDrawer, setDrawer } from './contexts/drawer'
import LanguageContext from './contexts/language'
import { getMessage, MessageContext, setMessage, showMessageEffect } from './contexts/message'
import { getOverlay, OverlayContext, setOverlay } from './contexts/overlay'
import { getWebSocket, PeachWSContext, setPeachWS } from './utils/peachAPI/websocket'

import Drawer from './components/Drawer'
import Message from './components/Message'
import Overlay from './components/Overlay'

import { DEV } from '@env'
import { setUnhandledPromiseRejectionTracker } from 'react-native-promise-rejection-utils'
import { APPVERSION, ISEMULATOR, LATESTAPPVERSION, MINAPPVERSION } from './constants'
import handleNotificationsEffect from './effects/handleNotificationsEffect'
import { initApp } from './init'
import websocket from './init/websocket'
import AnalyticsPrompt from './overlays/AnalyticsPrompt'
import { account, updateSettings } from './utils/account'
import { getChatNotifications } from './utils/chat'
import { error, info } from './utils/log'
import { getRequiredActionCount } from './utils/offer'
import { compatibilityCheck, linkToAppStore } from './utils/system'

enableScreens()

const Stack = createStackNavigator<RootStackParamList>()

/**
 * @description Method to determine weather header should be shown
 * @param view view id
 * @returns true if view should show header
 */
const showHeader = (view: keyof RootStackParamList) => views.find((v) => v.name === view)?.showHeader

/**
 * @description Method to determine weather header should be shown
 * @param view view id
 * @returns true if view should show header
 */
const showFooter = (view: keyof RootStackParamList) => views.find((v) => v.name === view)?.showFooter

const App: React.FC = () => {
  const [appContext, updateAppContext] = useReducer(setAppContext, getAppContext())
  const [bitcoinContext, updateBitcoinContext] = useReducer(setBitcoinContext, getBitcoinContext())

  const [messageState, updateMessage] = useReducer(setMessage, getMessage())
  const [{ title: drawerTitle, content: drawerContent, show: showDrawer, onClose: onCloseDrawer }, updateDrawer]
    = useReducer(setDrawer, getDrawer())
  const [{ content, showCloseIcon, showCloseButton, help, onClose: onCloseOverlay }, updateOverlay] = useReducer(
    setOverlay,
    getOverlay(),
  )
  const [peachWS, updatePeachWS] = useReducer(setPeachWS, getWebSocket())
  const { width } = Dimensions.get('window')
  const slideInAnim = useRef(new Animated.Value(-width)).current
  const navigationRef = useNavigationContainerRef() as NavigationContainerRefWithCurrent<RootStackParamList>

  const [currentPage, setCurrentPage] = useState<keyof RootStackParamList>(account?.publicKey ? 'home' : 'welcome')
  const getCurrentPage = () => currentPage

  StatusBar.setBarStyle('dark-content', true)
  ErrorUtils.setGlobalHandler((err: Error) => {
    error(err)
    updateMessage({
      msgKey: (err as Error).message || 'GENERAL_ERROR',
      level: 'ERROR',
      action: () => navigationRef.navigate('contact', {}),
      actionLabel: i18n('contactUs'),
      actionIcon: 'mail',
    })
  })

  setUnhandledPromiseRejectionTracker((id, err) => {
    error(err)
    updateMessage({
      msgKey: (err as Error).message || 'GENERAL_ERROR',
      level: 'ERROR',
      action: () => navigationRef.navigate('contact', {}),
      actionLabel: i18n('contactUs'),
      actionIcon: 'mail',
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
      await initApp(navigationRef, updateMessage)
      updateAppContext({
        notifications: getChatNotifications() + getRequiredActionCount(),
      })
      if (typeof account.settings.enableAnalytics === 'undefined') {
        updateOverlay({
          content: <AnalyticsPrompt />,
          showCloseIcon: true,
          onClose: () => {
            analytics().setAnalyticsCollectionEnabled(false)
            updateSettings(
              {
                enableAnalytics: false,
              },
              true,
            )
          },
        })
      }
      if (!compatibilityCheck(APPVERSION, MINAPPVERSION)) {
        updateMessage({
          msgKey: 'CRITICAL_UPDATE_AVAILABLE',
          level: 'ERROR',
          keepAlive: true,
          action: linkToAppStore,
          actionLabel: i18n('download'),
          actionIcon: 'download',
        })
      } else if (!compatibilityCheck(APPVERSION, LATESTAPPVERSION)) {
        updateMessage({
          msgKey: 'UPDATE_AVAILABLE',
          level: 'WARN',
          keepAlive: true,
          action: linkToAppStore,
          actionLabel: i18n('download'),
          actionIcon: 'download',
        })
      }
    })()
  }, [])

  useEffect(
    handleNotificationsEffect({
      getCurrentPage,
      updateOverlay,
      navigation: navigationRef,
    }),
    [currentPage],
  )

  useEffect(websocket(updatePeachWS, updateMessage), [])

  const onNavStateChange = (state: NavigationState | undefined) => {
    if (state) setCurrentPage(state.routes[state.routes.length - 1].name)
  }

  useEffect(() => {
    info('Navigation event', currentPage)
    // Disable OS back button
    analytics().logScreenView({
      screen_name: currentPage as string,
    })
  }, [currentPage])

  return (
    <GestureHandlerRootView style={tw`bg-white-1`}>
      <AvoidKeyboard>
        <SafeAreaView>
          <LanguageContext.Provider value={{ locale: i18n.getLocale() }}>
            <PeachWSContext.Provider value={peachWS}>
              <AppContext.Provider value={[appContext, updateAppContext]}>
                <BitcoinContext.Provider value={[bitcoinContext, updateBitcoinContext]}>
                  <MessageContext.Provider value={[messageState, updateMessage]}>
                    <DrawerContext.Provider
                      value={[{ title: '', content: null, show: false, onClose: () => {} }, updateDrawer]}
                    >
                      <OverlayContext.Provider
                        value={[
                          { content, showCloseButton: false, showCloseIcon: false, help: false, onClose: () => {} },
                          updateOverlay,
                        ]}
                      >
                        <View style={tw`h-full flex-col`}>
                          {showHeader(currentPage) ? <Header style={tw`z-10`} navigation={navigationRef} /> : null}
                          <Drawer
                            title={drawerTitle}
                            content={drawerContent}
                            show={showDrawer}
                            onClose={onCloseDrawer}
                          />
                          {content ? (
                            <Overlay
                              content={content}
                              help={help}
                              showCloseIcon={showCloseIcon}
                              showCloseButton={showCloseButton}
                              onClose={onCloseOverlay}
                            />
                          ) : null}
                          {messageState.msgKey ? (
                            <Animated.View style={[tw`absolute z-20 w-full`, { top: slideInAnim }]}>
                              <Message {...messageState} />
                            </Animated.View>
                          ) : null}
                          <View style={tw`h-full flex-shrink`}>
                            <NavigationContainer ref={navigationRef} onStateChange={onNavStateChange}>
                              <Stack.Navigator
                                detachInactiveScreens={true}
                                screenOptions={{
                                  gestureEnabled: false,
                                  headerShown: false,
                                  cardStyle: tw`bg-white-1`,
                                }}
                              >
                                {views.map((view) => (
                                  <Stack.Screen
                                    name={view.name}
                                    component={view.component}
                                    key={view.name}
                                    options={{ animationEnabled: false }}
                                  />
                                ))}
                              </Stack.Navigator>
                            </NavigationContainer>
                          </View>
                          {showFooter(currentPage) ? (
                            <Footer
                              style={tw`z-10`}
                              active={currentPage}
                              navigation={navigationRef}
                              setCurrentPage={setCurrentPage}
                            />
                          ) : null}
                        </View>
                      </OverlayContext.Provider>
                    </DrawerContext.Provider>
                  </MessageContext.Provider>
                </BitcoinContext.Provider>
              </AppContext.Provider>
            </PeachWSContext.Provider>
          </LanguageContext.Provider>
        </SafeAreaView>
      </AvoidKeyboard>
    </GestureHandlerRootView>
  )
}
export default App
