import React, { useEffect, useReducer, useRef, useState } from 'react'
import { Dimensions, SafeAreaView, View, Animated } from 'react-native'
import tw from './styles/tailwind'
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

import LanguageContext from './contexts/language'
import BitcoinContext, { getBitcoinContext, setBitcoinContext } from './contexts/bitcoin'
import AppContext, { getAppContext, setAppContext } from './contexts/app'

import i18n from './utils/i18n'
import { AvoidKeyboard, Footer, Header } from './components'
import Message from './components/Message'

import { getMessage, MessageContext, setMessage, showMessageEffect } from './contexts/message'
import { account } from './utils/account'
import Overlay from './components/Overlay'
import { getOverlay, OverlayContext, setOverlay } from './contexts/overlay'
import { sleep } from './utils/performance'
import { setUnhandledPromiseRejectionTracker } from 'react-native-promise-rejection-utils'
import { info, error } from './utils/log'
import { getWebSocket, PeachWSContext, setPeachWS } from './utils/peachAPI/websocket'
import events from './init/events'
import session from './init/session'
import websocket from './init/websocket'
import pgp from './init/pgp'
import fcm from './init/fcm'
import { APPVERSION, MINAPPVERSION } from './constants'
import { compatibilityCheck } from './utils/system'
import MatchAccepted from './overlays/MatchAccepted'
import PaymentMade from './overlays/PaymentMade'
import { handlePushNotification } from './utils/navigation'
import views from './views'
import YouGotADispute from './overlays/YouGotADispute'
import OfferExpired from './overlays/OfferExpired'
import { getOffer } from './utils/offer'

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


const requestUserPermission = async () => {
  info('Requesting notification permissions')
  const authStatus = await messaging().requestPermission({
    alert: true,
    badge: true,
    sound: true,
  })

  info('Permission status:', authStatus)
}

/**
 * @description Method to initialize app by retrieving app session and user account
 * @param navigationRef reference to navigation
 */
const initApp = async (
  navigationRef: NavigationContainerRefWithCurrent<RootStackParamList>,
  updateMessage: React.Dispatch<MessageState>,
): Promise<void> => {
  const goHome = () => {
    if (navigationRef.getCurrentRoute()?.name === 'splashScreen') {
      if (account?.settings?.skipTutorial) {
        navigationRef.navigate('home', {})
      } else {
        navigationRef.navigate('welcome', {})
      }
    }
    requestUserPermission()
  }
  const timeout = setTimeout(() => {
    // go home anyway after 30 seconds
    goHome()
    updateMessage({ msg: i18n('NETWORK_ERROR'), level: 'ERROR' })
  }, 30000)


  events()
  await session()
  fcm()

  try {
    await pgp()
  } catch (e) {
    error(e)
  }

  let waitForNavCounter = 100
  while (!navigationRef.isReady()) {
    if (waitForNavCounter === 0) {
      throw new Error('Failed to initialize navigation')
    }
    // eslint-disable-next-line no-await-in-loop
    await sleep(100)
    waitForNavCounter--
  }
  goHome()
  clearTimeout(timeout)
}

// eslint-disable-next-line max-lines-per-function
const App: React.FC = () => {
  const [appContext, updateAppContext] = useReducer(setAppContext, getAppContext())
  const [bitcoinContext, updateBitcoinContext] = useReducer(setBitcoinContext, getBitcoinContext())

  const [{ template, msg, level, time }, updateMessage] = useReducer(setMessage, getMessage())
  const [peachWS, updatePeachWS] = useReducer(setPeachWS, getWebSocket())
  const [{ content, showCloseIcon, showCloseButton }, updateOverlay] = useReducer(setOverlay, getOverlay())
  const { width } = Dimensions.get('window')
  const slideInAnim = useRef(new Animated.Value(-width)).current
  const navigationRef = useNavigationContainerRef() as NavigationContainerRefWithCurrent<RootStackParamList>

  const [currentPage, setCurrentPage] = useState<keyof RootStackParamList>('splashScreen')

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
      if (!compatibilityCheck(APPVERSION, MINAPPVERSION)) {
        updateMessage({ msg: i18n('app.incompatible'), level: 'WARN' })
      }
    })()
  }, [])

  useEffect(() => {
    info('Subscribe to push notifications')
    const unsubscribe = messaging().onMessage(async (remoteMessage): Promise<null|void> => {
      info('A new FCM message arrived! ' + JSON.stringify(remoteMessage), 'currentPage' + currentPage)
      if (remoteMessage.data && remoteMessage.data.type === 'offer.expired'
        && /buy|sell|home|settings|offers/u.test(currentPage as string)) {
        const offer = getOffer(remoteMessage.data.offerId) as SellOffer
        const args = remoteMessage.notification?.bodyLocArgs

        return updateOverlay({
          content: <OfferExpired offer={offer} days={args ? args[0] || '15' : '15'} navigation={navigationRef} />,
          showCloseButton: false
        })
      }
      if (remoteMessage.data && remoteMessage.data.type === 'contract.contractCreated'
        && /buy|sell|home|settings|offers/u.test(currentPage as string)) {
        return updateOverlay({
          content: <MatchAccepted contractId={remoteMessage.data.contractId} navigation={navigationRef} />,
          showCloseButton: false
        })
      }
      if (remoteMessage.data && remoteMessage.data.type === 'contract.paymentMade'
        && /buy|sell|home|settings|offers/u.test(currentPage as string)) {
        return updateOverlay({
          content: <PaymentMade contractId={remoteMessage.data.contractId} navigation={navigationRef} />,
          showCloseButton: false
        })
      }
      if (remoteMessage.data && remoteMessage.data.type === 'contract.disputeRaised') {
        return updateOverlay({
          content: <YouGotADispute
            contractId={remoteMessage.data.contractId}
            message={remoteMessage.data.message}
            navigation={navigationRef} />,
          showCloseButton: false
        })
      }
      return null
    })

    messaging().onNotificationOpenedApp(remoteMessage => {
      info('Notification caused app to open from background state:', JSON.stringify(remoteMessage))
      if (remoteMessage.data) handlePushNotification(remoteMessage.data, navigationRef)
    })

    return unsubscribe
  }, [])

  useEffect(websocket(updatePeachWS), [])

  const onNavStateChange = (state: NavigationState | undefined) => {
    if (state) setCurrentPage(() => state.routes[state.routes.length - 1].name)
  }

  return <GestureHandlerRootView style={tw`bg-white-1`}><AvoidKeyboard><SafeAreaView>
    <LanguageContext.Provider value={{ locale: i18n.getLocale() }}>
      <PeachWSContext.Provider value={peachWS}>
        <AppContext.Provider value={[appContext, updateAppContext]}>
          <BitcoinContext.Provider value={[bitcoinContext, updateBitcoinContext]}>
            <MessageContext.Provider value={[{ template, msg, level }, updateMessage]}>
              <OverlayContext.Provider value={[
                { content, showCloseButton: false, showCloseIcon: false },
                updateOverlay
              ]}>
                <View style={tw`h-full flex-col`}>
                  {showHeader(currentPage)
                    ? <Header style={tw`z-10`} navigation={navigationRef} />
                    : null
                  }
                  {content
                    ? <Overlay content={content} showCloseIcon={showCloseIcon} showCloseButton={showCloseButton} />
                    : null
                  }
                  {template || msg
                    ? <Animated.View style={[tw`absolute z-20 w-full`, { left: slideInAnim }]}>
                      <Message template={template} msg={msg} level={level} style={{ minHeight: 60 }} />
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
            </MessageContext.Provider>
          </BitcoinContext.Provider>
        </AppContext.Provider>
      </PeachWSContext.Provider>
    </LanguageContext.Provider>
  </SafeAreaView></AvoidKeyboard></GestureHandlerRootView>
}
export default App