import React, { useEffect, useReducer, useRef, useState } from 'react'
import { Dimensions, SafeAreaView, View, Animated, BackHandler } from 'react-native'
import 'react-native-gesture-handler'
// eslint-disable-next-line no-duplicate-imports
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import {
  NavigationContainer,
  NavigationContainerRefWithCurrent,
  NavigationState,
  useNavigationContainerRef
} from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { enableScreens } from 'react-native-screens'
import analytics from '@react-native-firebase/analytics'

import { AvoidKeyboard, Footer, Header } from './components'
import tw from './styles/tailwind'
import i18n from './utils/i18n'
import views from './views'

import { PeachWSContext, getWebSocket, setPeachWS } from './utils/peachAPI/websocket'
import LanguageContext from './contexts/language'
import BitcoinContext, { getBitcoinContext, setBitcoinContext } from './contexts/bitcoin'
import AppContext, { getAppContext, setAppContext } from './contexts/app'
import { DrawerContext, getDrawer, setDrawer } from './contexts/drawer'
import { OverlayContext, getOverlay, setOverlay } from './contexts/overlay'
import { MessageContext, getMessage, setMessage, showMessageEffect } from './contexts/message'

import Message from './components/Message'
import Overlay from './components/Overlay'
import Drawer from './components/Drawer'

import { setUnhandledPromiseRejectionTracker } from 'react-native-promise-rejection-utils'
import { info, error } from './utils/log'
import websocket from './init/websocket'
import { APPVERSION, ISEMULATOR, LATESTAPPVERSION, MINAPPVERSION } from './constants'
import { compatibilityCheck } from './utils/system'
import { CriticalUpdate, NewVersionAvailable } from './messageBanners/UpdateApp'
import handleNotificationsEffect from './effects/handleNotificationsEffect'
import { getChatNotifications } from './utils/chat'
import { getRequiredActionCount } from './utils/offer'
import { DEV } from '@env'
import { initApp } from './init'
import { account, updateSettings } from './utils/account'
import AnalyticsPrompt from './overlays/AnalyticsPrompt'

enableScreens()

const Stack = createStackNavigator<RootStackParamList>()

/**
 * @description Method to determine weather header should be shown
 * @param view view id
 * @returns true if view should show header
 */
const showHeader = (view: keyof RootStackParamList) => views.find(v => v.name === view)?.showHeader

/**
 * @description Method to determine weather header should be shown
 * @param view view id
 * @returns true if view should show header
 */
const showFooter = (view: keyof RootStackParamList) => views.find(v => v.name === view)?.showFooter

// eslint-disable-next-line max-lines-per-function
const App: React.FC = () => {
  const [appContext, updateAppContext] = useReducer(setAppContext, getAppContext())
  const [bitcoinContext, updateBitcoinContext] = useReducer(setBitcoinContext, getBitcoinContext())

  const [{ template, msg, level, close, time }, updateMessage] = useReducer(setMessage, getMessage())
  const [
    {
      title: drawerTitle,
      content: drawerContent,
      show: showDrawer,
      onClose: onCloseDrawer
    }, updateDrawer
  ] = useReducer(setDrawer, getDrawer())
  const [
    {
      content,
      showCloseIcon,
      showCloseButton,
      help,
      onClose: onCloseOverlay
    },
    updateOverlay
  ] = useReducer(setOverlay, getOverlay())
  const [peachWS, updatePeachWS] = useReducer(setPeachWS, getWebSocket())
  const { width } = Dimensions.get('window')
  const slideInAnim = useRef(new Animated.Value(-width)).current
  const navigationRef = useNavigationContainerRef() as NavigationContainerRefWithCurrent<RootStackParamList>

  const [currentPage, setCurrentPage] = useState<keyof RootStackParamList>('splashScreen')
  const getCurrentPage = () => currentPage

  ErrorUtils.setGlobalHandler((err: Error) => {
    error(err)
    updateMessage({ msg: i18n((err as Error).message || 'error.general'), level: 'ERROR' })
  })

  setUnhandledPromiseRejectionTracker((id, err) => {
    error(err)
    updateMessage({ msg: i18n((err as Error).message || 'error.general'), level: 'ERROR' })
  })

  useEffect(showMessageEffect(template || msg, width, slideInAnim), [msg, time])

  useEffect(() => {
    if (DEV !== 'true' && ISEMULATOR) {
      error(new Error('NO_EMULATOR'))
      updateMessage({ msg: i18n('NO_EMULATOR'), level: 'ERROR' })

      return
    }

    (async () => {
      await initApp(navigationRef, updateMessage)
      updateAppContext({
        notifications: getChatNotifications() + getRequiredActionCount()
      })
      if (typeof account.settings.enableAnalytics === 'undefined') {
        updateOverlay({
          content: <AnalyticsPrompt/>,
          showCloseIcon: true,
          onClose: () => {
            analytics().setAnalyticsCollectionEnabled(false)
            updateSettings({
              enableAnalytics: false
            }, true)
          }
        })
      }
      if (!compatibilityCheck(APPVERSION, MINAPPVERSION)) {
        updateMessage({ template: <CriticalUpdate />, level: 'ERROR', close: false })
      } else if (!compatibilityCheck(APPVERSION, LATESTAPPVERSION)) {
        updateMessage({ template: <NewVersionAvailable />, level: 'WARN' })
      }
    })()
  }, [])

  useEffect(handleNotificationsEffect({
    getCurrentPage,
    updateOverlay,
    navigationRef
  }), [currentPage])

  useEffect(websocket(updatePeachWS), [])
  useEffect(() => {
    const listener = BackHandler.addEventListener('hardwareBackPress', () => {
      if (drawerContent) {
        updateDrawer({ show: false })
        return true
      }
      if (content) return true
      return false
    })
    return () => {
      listener.remove()
    }
  }, [drawerContent, content])

  const onNavStateChange = (state: NavigationState | undefined) => {
    if (state) setCurrentPage(state.routes[state.routes.length - 1].name)
  }

  useEffect(() => {
    info('Navigation event', currentPage)
    // Disable OS back button
    analytics().logScreenView({
      screen_name: currentPage as string
    })
  }, [currentPage])

  return <GestureHandlerRootView style={tw`bg-white-1`}><AvoidKeyboard><SafeAreaView>
    <LanguageContext.Provider value={{ locale: i18n.getLocale() }}>
      <PeachWSContext.Provider value={peachWS}>
        <AppContext.Provider value={[appContext, updateAppContext]}>
          <BitcoinContext.Provider value={[bitcoinContext, updateBitcoinContext]}>
            <MessageContext.Provider value={[{ template, msg, level, close }, updateMessage]}>
              <DrawerContext.Provider value={[
                { title: '', content: null, show: false, onClose: () => {} },
                updateDrawer
              ]}>
                <OverlayContext.Provider value={[
                  { content, showCloseButton: false, showCloseIcon: false, help: false, onClose: onCloseOverlay },
                  updateOverlay
                ]}>
                  <View style={tw`h-full flex-col`}>
                    {showHeader(currentPage)
                      ? <Header style={tw`z-10`} navigation={navigationRef} />
                      : null
                    }
                    <Drawer title={drawerTitle} content={drawerContent} show={showDrawer} onClose={onCloseDrawer} />
                    {content
                      ? <Overlay content={content} help={help}
                        showCloseIcon={showCloseIcon} showCloseButton={showCloseButton}
                        onClose={onCloseOverlay} />
                      : null
                    }
                    {template || msg
                      ? <Animated.View style={[tw`absolute z-20 w-full`, { left: slideInAnim }]}>
                        <Message template={template} msg={msg} level={level} close={close} style={{ minHeight: 60 }} />
                      </Animated.View>
                      : null
                    }
                    <View style={tw`h-full flex-shrink`}>
                      <NavigationContainer ref={navigationRef} onStateChange={onNavStateChange}>
                        <Stack.Navigator detachInactiveScreens={true} screenOptions={{
                          gestureEnabled: false,
                          headerShown: false,
                          cardStyle: tw`bg-white-1`,
                        }}>
                          {views.map(view => <Stack.Screen
                            name={view.name}
                            component={view.component} key={view.name}
                            options={{ animationEnabled: false }}
                          />)}
                        </Stack.Navigator>
                      </NavigationContainer>
                    </View>
                    {showFooter(currentPage)
                      ? <Footer style={tw`z-10`} active={currentPage} navigation={navigationRef}
                        setCurrentPage={setCurrentPage} />
                      : null
                    }
                  </View>
                </OverlayContext.Provider>
              </DrawerContext.Provider>
            </MessageContext.Provider>
          </BitcoinContext.Provider>
        </AppContext.Provider>
      </PeachWSContext.Provider>
    </LanguageContext.Provider>
  </SafeAreaView></AvoidKeyboard></GestureHandlerRootView>
}
export default App