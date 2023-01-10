import React, { ReactElement, useContext, useEffect, useMemo } from 'react'
import { BackHandler, Modal, Pressable, View, ViewStyle } from 'react-native'
import { Text } from '.'
import { OverlayContext } from '../contexts/overlay'
import tw from '../styles/tailwind'
import i18n from '../utils/i18n'
import Icon from './Icon'

type LevelColorMap = {
  bg1: Record<Level, ViewStyle>
  bg2: Record<Level, ViewStyle>
}

const levelColorMap: LevelColorMap = {
  bg1: {
    DEFAULT: tw`bg-black-3`,
    APP: tw`bg-primary-main`,
    SUCCESS: tw`bg-success-main`,
    WARN: tw`bg-warning-main`,
    ERROR: tw`bg-error-main`,
    INFO: tw`bg-info-light`,
  },
  bg2: {
    DEFAULT: tw`bg-primary-background-light`,
    APP: tw`bg-primary-background-dark`,
    SUCCESS: tw`bg-success-background`,
    WARN: tw`bg-warning-background`,
    ERROR: tw`bg-error-background`,
    INFO: tw`bg-info-background`,
  },
}

export const Overlay = ({
  title,
  content,
  action1,
  action2,
  level = 'DEFAULT',
  visible,
  requireUserAction,
}: OverlayState): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)
  const Content = content
  const closeOverlay = useMemo(() => () => updateOverlay({ visible: false }), [updateOverlay])

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      closeOverlay()
      return true
    })
    return () => {
      backHandler.remove()
    }
  }, [closeOverlay, content])

  const actionColor = level === 'WARN' ? tw`text-black-1` : tw`text-primary-background-light`

  return (
    <Modal transparent={true} visible={visible}>
      <View style={tw`items-center justify-center flex-1`} >
        <Pressable
          style={tw`absolute top-0 left-0 w-full h-full bg-black-1 opacity-40`}
          onPress={!requireUserAction ? closeOverlay : null}
        ></Pressable>
        <View style={tw`items-center w-full p-6`}>
        <View testID="overlay" style={[tw`m-10`, levelColorMap.bg1[level], tw`w-full shadow rounded-2xl`]}>
          <View style={[tw`p-4`, levelColorMap.bg2[level], tw`rounded-t-2xl`]}>
            {!!title && <Text style={tw`mb-1 h5 text-black-1`}>{title.toLocaleLowerCase()}</Text>}
            {content}
          </View>
          <View style={[tw`flex-row px-4 py-1`, !!action2 ? tw`justify-between` : tw`justify-center`]}>
            {!!action2 && (
              <Pressable onPress={!action2.disabled ? action2.callback : null}>
                <View style={[tw`flex flex-row items-center flex-shrink`, action2?.disabled && tw`opacity-50`]}>
                  <Icon id={action2.icon} color={actionColor.color} style={tw`w-4 h-4 mr-1`} />
                  <Text style={[tw`text-base leading-relaxed subtitle-1`, actionColor]}>{action2.label}</Text>
                </View>
              </Pressable>
            )}
            {
              <Pressable onPress={action1 ? (!action1.disabled ? action1.callback : null) : closeOverlay}>
                <View style={[tw`flex flex-row items-center flex-shrink`, action1?.disabled && tw`opacity-50`]}>
                  <Text style={[tw`text-base leading-relaxed subtitle-1`, actionColor]}>
                    {action1 ? action1.label : i18n('close')}
                  </Text>
                  <Icon id={action1 ? action1.icon : 'xSquare'} color={actionColor.color} style={tw`w-4 h-4 ml-1`} />
                </View>
              </Pressable>
            }
          </View>
        </View>
        </View>
      </View>
    </Modal>
  )
}

export default Overlay
