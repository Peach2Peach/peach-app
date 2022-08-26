import React, { useEffect, useReducer, useRef, useState } from 'react'
import { Dimensions, SafeAreaView, View, Animated, Alert } from 'react-native'
import NotificationBadge from '@msml/react-native-notification-badge'
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
import messaging from '@react-native-firebase/messaging'

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
import { account } from './utils/account'
import Overlay from './components/Overlay'
import Drawer from './components/Drawer'

import { sleep } from './utils/performance'
import { setUnhandledPromiseRejectionTracker } from 'react-native-promise-rejection-utils'
import { info, error } from './utils/log'
import events from './init/events'
import session, { getPeachInfo, getTrades } from './init/session'
import websocket from './init/websocket'
import pgp from './init/pgp'
import fcm from './init/fcm'
import { APPVERSION, LATESTAPPVERSION, MINAPPVERSION } from './constants'
import { compatibilityCheck, isIOS } from './utils/system'
import { CriticalUpdate, NewVersionAvailable } from './messageBanners/UpdateApp'
import handleNotificationsEffect from './effects/handleNotificationsEffect'
import { handlePushNotification } from './utils/navigation'
import { getSession, setSession } from './utils/session'
import { exists } from './utils/file'
import { getChatNotifications } from './utils/chat'
import { getRequiredActionCount } from './utils/offer'
import requestUserPermissions from './init/requestUserPermissions'
import { dataMigration } from './init/dataMigration'

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

const initialNavigation = async (
  navigationRef: NavigationContainerRefWithCurrent<RootStackParamList>,
  updateMessage: React.Dispatch<MessageState>,
  sessionInitiated: boolean,
) => {
  let waitForNavCounter = 100
  while (!navigationRef.isReady()) {
    if (waitForNavCounter === 0) {
      updateMessage({ msg: i18n('NAVIGATION_INIT_ERROR'), level: 'ERROR' })
      throw new Error('Failed to initialize navigation')
    }
    // eslint-disable-next-line no-await-in-loop
    await sleep(100)
    waitForNavCounter--
  }
  const initialNotification = await messaging().getInitialNotification()

  if (!sessionInitiated && await exists('/peach-account.json')) {
    navigationRef.navigate('login', {})
  } else if (initialNotification) {
    info('Notification caused app to open from quit state:', JSON.stringify(initialNotification))

    let notifications = Number(getSession().notifications || 0)
    if (notifications > 0) notifications -= 1
    if (isIOS()) NotificationBadge.setNumber(notifications)
    setSession({ notifications })

    if (initialNotification.data) handlePushNotification(initialNotification.data, navigationRef)
  } else if (navigationRef.getCurrentRoute()?.name === 'splashScreen') {
    if (account?.publicKey) {
      navigationRef.navigate('home', {})
    } else {
      navigationRef.navigate('welcome', {})
    }
  }

  messaging().onNotificationOpenedApp(remoteMessage => {
    info('Notification caused app to open from background state:', JSON.stringify(remoteMessage))

    let notifications = Number(getSession().notifications || 0)
    if (notifications > 0) notifications -= 1
    if (isIOS()) NotificationBadge.setNumber(notifications)
    setSession({ notifications })

    if (remoteMessage.data) handlePushNotification(remoteMessage.data, navigationRef)
  })
}

/**
 * @description Method to initialize app by retrieving app session and user account
 * @param navigationRef reference to navigation
 */
const initApp = async (
  navigationRef: NavigationContainerRefWithCurrent<RootStackParamList>,
  updateMessage: React.Dispatch<MessageState>,
): Promise<void> => {


  const timeout = setTimeout(() => {
    // go home anyway after 30 seconds
    error(new Error('STARTUP_ERROR'))
    initialNavigation(navigationRef, updateMessage, !!account?.publicKey)
  }, 30000)


  events()
  const sessionInitiated = await session()

  await getPeachInfo(account)
  if (account?.publicKey) {
    getTrades()
    fcm()
    pgp()
    dataMigration()
  }

  clearTimeout(timeout)

  initialNavigation(navigationRef, updateMessage, sessionInitiated)

  await requestUserPermissions()
}

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
      help
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
    (async () => {
      await initApp(navigationRef, updateMessage)
      updateAppContext({
        notifications: getChatNotifications() + getRequiredActionCount()
      })
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

  const onNavStateChange = (state: NavigationState | undefined) => {
    if (state) setCurrentPage(state.routes[state.routes.length - 1].name)
  }

  useEffect(() => {
    info('Navigation event', currentPage)
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
                  { content, showCloseButton: false, showCloseIcon: false, help: false },
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
                        showCloseIcon={showCloseIcon} showCloseButton={showCloseButton}/>
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