import { DEV } from '@env'
import { useEffect, useRef } from 'react'
import { Animated, SafeAreaView, TextStyle, TouchableOpacity, View, ViewStyle, useWindowDimensions } from 'react-native'
import { setUnhandledPromiseRejectionTracker } from 'react-native-promise-rejection-utils'
import SplashScreen from 'react-native-splash-screen'
import { shallow } from 'zustand/shallow'
import { Icon, Placeholder, Text } from '..'
import { IconType } from '../../assets/icons'
import { ISEMULATOR } from '../../constants'
import { useNavigation } from '../../hooks'
import { initApp } from '../../init/initApp'
import { requestUserPermissions } from '../../init/requestUserPermissions'
import { VerifyYouAreAHumanPopup } from '../../popups/warning/VerifyYouAreAHumanPopup'
import { usePopupStore } from '../../store/usePopupStore'
import tw from '../../styles/tailwind'
import { account } from '../../utils/account'
import i18n from '../../utils/i18n'
import { messageShadow } from '../../utils/layout/shadows'
import { error } from '../../utils/log'
import { parseError } from '../../utils/result'
import { isNetworkError } from '../../utils/system'
import { iconMap } from './iconMap'
import { useMessageState } from './useMessageState'

type LevelColorMap = {
  bg: Record<Level, ViewStyle>
  text: Record<Level, TextStyle>
}
const levelColorMap: LevelColorMap = {
  bg: {
    APP: tw`bg-primary-main`,
    SUCCESS: tw`bg-success-background-main`,
    WARN: tw`bg-warning-background`,
    ERROR: tw`bg-error-main`,
    INFO: tw`bg-info-background`,
    DEFAULT: tw`bg-black-6`,
  },
  text: {
    APP: tw`text-primary-background`,
    SUCCESS: tw`text-black-1`,
    WARN: tw`text-black-1`,
    ERROR: tw`text-primary-background-light`,
    INFO: tw`text-black-1`,
    DEFAULT: tw`text-black-1`,
  },
}

export const Message = () => {
  const setPopup = usePopupStore((state) => state.setPopup)
  const [{ level, msgKey, bodyArgs = [], action, onClose, time, keepAlive }, updateMessage] = useMessageState(
    (state) => [
      {
        level: state.level,
        msgKey: state.msgKey,
        bodyArgs: state.bodyArgs,
        action: state.action,
        onClose: state.onClose,
        time: state.time,
        keepAlive: state.keepAlive,
      },
      state.updateMessage,
    ],
    shallow,
  )
  const navigation = useNavigation()

  ErrorUtils.setGlobalHandler((err: Error) => {
    error(err)
    updateMessage({
      msgKey: err.message || 'GENERAL_ERROR',
      level: 'ERROR',
      action: {
        callback: () => navigation.navigate('contact'),
        label: i18n('contactUs'),
        icon: 'mail',
      },
    })
  })

  setUnhandledPromiseRejectionTracker((id, err) => {
    error(err)
    const errorMessage = parseError(err)

    if (errorMessage === 'HUMAN_VERIFICATION_REQUIRED') {
      setPopup(<VerifyYouAreAHumanPopup />)
      return
    }
    const errorMsgKey = isNetworkError(errorMessage) ? 'NETWORK_ERROR' : errorMessage
    updateMessage({
      msgKey: errorMsgKey || 'GENERAL_ERROR',
      level: 'ERROR',
      action: {
        callback: () => navigation.navigate('contact'),
        label: i18n('contactUs'),
        icon: 'mail',
      },
    })
  })

  useEffect(() => {
    if (DEV !== 'true' && ISEMULATOR) {
      error(new Error('NO_EMULATOR'))
      updateMessage({ msgKey: 'NO_EMULATOR', level: 'ERROR' })

      return
    }

    (async () => {
      const statusResponse = await initApp()

      console.log(statusResponse)
      if (!statusResponse || statusResponse.error) {
        if (statusResponse?.error === 'HUMAN_VERIFICATION_REQUIRED') {
          setPopup(<VerifyYouAreAHumanPopup />)
        } else {
          updateMessage({
            msgKey: statusResponse?.error || 'NETWORK_ERROR',
            level: 'ERROR',
            action: {
              callback: () => navigation.navigate('contact'),
              label: i18n('contactUs'),
              icon: 'mail',
            },
          })
        }
      }
      navigation.navigate(account.publicKey ? 'buy' : 'welcome')
      requestUserPermissions()
      SplashScreen.hide()
    })()
  }, [])

  const { width } = useWindowDimensions()
  const top = useRef(new Animated.Value(-width)).current

  useEffect(() => {
    let slideOutTimeout: NodeJS.Timer

    if (msgKey) {
      Animated.timing(top, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start()

      if (!keepAlive) {
        slideOutTimeout = setTimeout(
          () =>
            Animated.timing(top, {
              toValue: -width,
              duration: 300,
              useNativeDriver: false,
            }).start(),
          1000 * 10,
        )
      }
    }

    return () => clearTimeout(slideOutTimeout)
  }, [msgKey, time])

  if (!msgKey) return null

  const icon: IconType | undefined = iconMap[msgKey]
  let title = i18n(`${msgKey}.title`)
  let message = i18n(`${msgKey}.text`, ...bodyArgs)

  if (title === `${msgKey}.title`) title = ''
  if (message === `${msgKey}.text`) {
    message = i18n(msgKey, ...bodyArgs)
  }

  const closeMessage = () => {
    updateMessage({ msgKey: undefined, level: 'ERROR' })
    if (onClose) onClose()
  }

  return (
    <Animated.View style={[tw`absolute z-20 w-full`, { top }]}>
      <SafeAreaView>
        <View
          style={[
            tw`flex items-center justify-center px-4 pt-4 pb-2 m-6 rounded-2xl`,
            messageShadow,
            levelColorMap.bg[level],
          ]}
        >
          <View style={tw`p-2`}>
            <View style={tw`flex-row items-center justify-center`}>
              {!!icon && <Icon id={icon} style={tw`w-5 h-5 mr-2`} color={levelColorMap.text[level].color} />}
              {!!title && <Text style={[tw`text-center h6`, levelColorMap.text[level]]}>{title}</Text>}
            </View>
            {!!message && (
              <Text style={[tw`text-center body-m`, levelColorMap.text[level], !!title && tw`mt-1`]}>{message}</Text>
            )}
          </View>
          <View style={tw`flex flex-row items-center justify-between w-full mt-1`}>
            {action ? (
              <TouchableOpacity onPress={action.callback} style={tw`flex flex-row items-center`}>
                {!!action.icon && <Icon id={action.icon} style={tw`w-4 h-4`} color={levelColorMap.text[level].color} />}
                <Text style={[tw`leading-relaxed subtitle-2`, levelColorMap.text[level]]}> {action.label}</Text>
              </TouchableOpacity>
            ) : (
              <Placeholder />
            )}
            <TouchableOpacity onPress={closeMessage} style={tw`flex flex-row items-center text-right`}>
              <Text style={[tw`leading-relaxed subtitle-2`, levelColorMap.text[level]]}>{i18n('close')} </Text>
              <Icon id="xSquare" style={tw`w-4 h-4`} color={levelColorMap.text[level].color} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Animated.View>
  )
}
