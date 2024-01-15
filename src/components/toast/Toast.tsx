import { atom, useAtomValue, useSetAtom } from 'jotai'
import { useEffect, useRef } from 'react'
import { Animated, StyleProp, TouchableOpacity, View, ViewStyle, useWindowDimensions } from 'react-native'
import { setUnhandledPromiseRejectionTracker } from 'react-native-promise-rejection-utils'
import { IconType } from '../../assets/icons'
import { useNavigation } from '../../hooks/useNavigation'
import { VerifyYouAreAHumanPopup } from '../../popups/warning/VerifyYouAreAHumanPopup'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { error } from '../../utils/log/error'
import { parseError } from '../../utils/result/parseError'
import { isNetworkError } from '../../utils/system/isNetworkError'
import { Icon } from '../Icon'
import { useSetPopup } from '../popup/Popup'
import { PeachText } from '../text/PeachText'
import { iconMap } from './iconMap'

type LevelColorMap = {
  [key in MessageState['level']]: {
    backgroundColor: string | undefined
    color: string | undefined
  }
}
const levelColorMap: LevelColorMap = {
  WARN: {
    backgroundColor: tw.color('warning-mild-1'),
    color: tw.color('black-100'),
  },
  ERROR: {
    backgroundColor: tw.color('error-main'),
    color: tw.color('primary-background-light'),
  },
  DEFAULT: {
    backgroundColor: tw.color('black-5'),
    color: tw.color('black-100'),
  },
}

const toastAtom = atom<MessageState>({ level: 'DEFAULT', keepAlive: false })

export const useSetToast = () => useSetAtom(toastAtom)

export const Message = () => {
  const setPopup = useSetPopup()
  const { level, msgKey, bodyArgs = [], action, onClose, keepAlive } = useAtomValue(toastAtom)
  const navigation = useNavigation()
  const setToast = useSetToast()

  ErrorUtils.setGlobalHandler((err: Error) => {
    error(err)
    setToast({
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
    setToast({
      msgKey: errorMsgKey || 'GENERAL_ERROR',
      level: 'ERROR',
      action: {
        callback: () => navigation.navigate('contact'),
        label: i18n('contactUs'),
        icon: 'mail',
      },
    })
  })

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
  }, [msgKey])

  if (!msgKey) return null

  const icon: IconType | undefined = iconMap[msgKey]
  let title = i18n(`${msgKey}.title`)
  let message = i18n(`${msgKey}.text`, ...bodyArgs)

  if (title === `${msgKey}.title`) title = ''
  if (message === `${msgKey}.text`) {
    message = i18n(msgKey, ...bodyArgs)
  }

  const closeMessage = () => {
    setToast({ msgKey: undefined, level: 'ERROR' })
    if (onClose) onClose()
  }

  const { color, backgroundColor } = levelColorMap[level]

  return (
    <Animated.View style={[tw`absolute z-20 w-full`, { top }]}>
      <View style={[tw`items-center justify-center gap-2 p-4 pb-3 rounded-2xl`, { backgroundColor }]}>
        <View style={tw`gap-1`}>
          <View style={tw`flex-row items-center justify-center gap-2`}>
            {!!icon && <Icon id={icon} size={20} color={color} />}
            {!!title && <PeachText style={[tw`text-center h6`, { color }]}>{title}</PeachText>}
          </View>
          {!!message && <PeachText style={[tw`text-center`, { color }]}>{message}</PeachText>}
        </View>
        <View style={tw`flex-row items-center justify-between flex-1`}>
          {action && <Action iconId={action.icon} label={action.label} onPress={action.callback} color={color} />}
          <Action
            iconId="xSquare"
            label={i18n('close')}
            onPress={closeMessage}
            color={color}
            style={tw`flex-row-reverse`}
          />
        </View>
      </View>
    </Animated.View>
  )
}

type ActionProps = {
  iconId: IconType
  label: string
  onPress: () => void
  color: string | undefined
  style?: StyleProp<ViewStyle>
}

function Action ({ iconId, label, onPress, color, style }: ActionProps) {
  return (
    <TouchableOpacity onPress={onPress} style={[tw`flex-row items-center flex-1 gap-1`, style]}>
      <Icon id={iconId} size={16} color={color} />
      <PeachText style={[tw`subtitle-2`, { color }]}>{label}</PeachText>
    </TouchableOpacity>
  )
}
