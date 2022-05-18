import React, { ReactElement, useEffect, useReducer, useRef, useState } from 'react'
import { Dimensions, SafeAreaView, View, Animated, LogBox } from 'react-native'
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
// import Home from './views/home/Home'
import Buy from './views/buy/Buy'
import Sell from './views/sell/Sell'
import Offers from './views/offers/Offers'
import SplashScreen from './views/splashScreen/SplashScreen'
import Welcome from './views/welcome/Welcome'
import NewUser from './views/newUser/NewUser'
import Message from './components/Message'
import RestoreBackup from './views/restoreBackup/RestoreBackup'
import Search from './views/search/Search'
import Contract from './views/contract/Contract'
import ContractChat from './views/contractChat/ContractChat'
import TradeComplete from './views/tradeComplete/TradeComplete'
import Offer from './views/offers/Offer'
import Settings from './views/settings/Settings'
import Contact from './views/contact/Contact'
import Report from './views/report/Report'
import Language from './views/settings/Language'
import Currency from './views/settings/Currency'
import Backups from './views/settings/Backups'
import SeedWords from './views/settings/SeedWords'
import PaymentMethods from './views/settings/PaymentMethods'
import Fees from './views/settings/Fees'
import Socials from './views/settings/Socials'
import Profile from './views/profile/Profile'

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
import { getOffer } from './utils/offer'
import MatchAccepted from './overlays/MatchAccepted'
import PaymentMade from './overlays/PaymentMade'
import { handlePushNotification } from './utils/navigation'

// TODO check if these messages have a fix
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  // eslint-disable-next-line max-len
  '[react-native-gesture-handler] Seems like you\'re using an old API with gesture components, check out new Gestures system!',
  /ViewPropTypes will be removed from React Native./u,
  /RCTBridge required dispatch_sync/u,
  /Can't perform a React state update on an unmounted component/u,
  /Require cycle/u,
])

enableScreens()

const Stack = createStackNavigator<RootStackParamList>()

type ViewType = {
  name: keyof RootStackParamList,
  component: (props: any) => ReactElement,
  showHeader: boolean,
  showFooter: boolean,
}

const views: ViewType[] = [
  { name: 'splashScreen', component: SplashScreen, showHeader: false, showFooter: false },
  { name: 'welcome', component: Welcome, showHeader: false, showFooter: false },
  { name: 'newUser', component: NewUser, showHeader: false, showFooter: false },
  { name: 'restoreBackup', component: RestoreBackup, showHeader: false, showFooter: false },
  // { name: 'home', component: Home, showHeader: false, showFooter: true },
  { name: 'home', component: Buy, showHeader: true, showFooter: true },
  { name: 'buy', component: Buy, showHeader: true, showFooter: true },
  { name: 'sell', component: Sell, showHeader: true, showFooter: true },
  { name: 'search', component: Search, showHeader: true, showFooter: true },
  { name: 'contract', component: Contract, showHeader: true, showFooter: true },
  { name: 'contractChat', component: ContractChat, showHeader: true, showFooter: true },
  { name: 'tradeComplete', component: TradeComplete, showHeader: true, showFooter: true },
  { name: 'offers', component: Offers, showHeader: true, showFooter: true },
  { name: 'offer', component: Offer, showHeader: true, showFooter: true },
  { name: 'profile', component: Profile, showHeader: true, showFooter: true },
  { name: 'settings', component: Settings, showHeader: true, showFooter: true },
  { name: 'language', component: Language, showHeader: true, showFooter: true },
  { name: 'currency', component: Currency, showHeader: true, showFooter: true },
  { name: 'backups', component: Backups, showHeader: true, showFooter: true },
  { name: 'seedWords', component: SeedWords, showHeader: true, showFooter: true },
  { name: 'paymentMethods', component: PaymentMethods, showHeader: true, showFooter: true },
  { name: 'fees', component: Fees, showHeader: true, showFooter: true },
  { name: 'socials', component: Socials, showHeader: true, showFooter: true },
  { name: 'contact', component: Contact, showHeader: true, showFooter: true },
  { name: 'report', component: Report, showHeader: true, showFooter: true },
]

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
    // go home anyway after 10 seconds
    goHome()
    updateMessage({ msg: i18n('NETWORK_ERROR'), level: 'ERROR' })
  }, 15000)


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

  const [{ msg, level, time }, updateMessage] = useReducer(setMessage, getMessage())
  const [peachWS, updatePeachWS] = useReducer(setPeachWS, getWebSocket())
  const [{ content, showCloseButton }, updateOverlay] = useReducer(setOverlay, getOverlay())
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

  useEffect(showMessageEffect(msg, width, slideInAnim), [msg, time])

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
      info('A new FCM message arrived! ' + JSON.stringify(remoteMessage))
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

  return <GestureHandlerRootView><AvoidKeyboard><SafeAreaView style={tw`bg-white-1`}>
    <LanguageContext.Provider value={{ locale: i18n.getLocale() }}>
      <PeachWSContext.Provider value={peachWS}>
        <AppContext.Provider value={[appContext, updateAppContext]}>
          <BitcoinContext.Provider value={[bitcoinContext, updateBitcoinContext]}>
            <MessageContext.Provider value={[{ msg, level }, updateMessage]}>
              <OverlayContext.Provider value={[{ content, showCloseButton: true }, updateOverlay]}>
                <View style={tw`h-full flex-col`}>
                  {showHeader(currentPage)
                    ? <Header style={tw`z-10`} />
                    : null
                  }
                  {msg
                    ? <Animated.View style={[tw`absolute z-20 w-full`, { left: slideInAnim }]}>
                      <Message msg={msg} level={level} style={{ minHeight: 60 }} />
                    </Animated.View>
                    : null
                  }
                  {content
                    ? <Overlay content={content} showCloseButton={showCloseButton} />
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