import React, { ReactElement, useContext, useEffect, useMemo } from 'react'
import { BackHandler, Modal, Pressable, View, ViewStyle } from 'react-native'
import { Text } from '.'
import { OverlayContext } from '../contexts/overlay'
import tw from '../styles/tailwind'
import i18n from '../utils/i18n'
import Icon from './Icon'

type LevelColorMap = {
  bg1: Record<OverlayLevel, ViewStyle>
  bg2: Record<OverlayLevel, ViewStyle>
}

const levelColorMap: LevelColorMap = {
  bg1: {
    DEFAULT: tw`bg-black-3`,
    APP: tw`bg-primary-light`,
    SUCCESS: tw`bg-success-light`,
    WARN: tw`bg-warning-light`,
    ERROR: tw`bg-error-main`,
    INFO: tw`bg-info-light`,
  },
  bg2: {
    DEFAULT: tw`bg-primary-background-light`,
    APP: tw`bg-primary-background-heavy`,
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
  level,
  visible,
  requireUserAction,
}: OverlayState): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)

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
      <View style={tw`flex-1 items-center justify-center`}>
        <Pressable
          style={tw`absolute top-0 left-0 w-full h-full bg-black-1 opacity-40`}
          onPress={!requireUserAction ? closeOverlay : null}
        ></Pressable>
        <View testID="overlay" style={[tw`m-10`, levelColorMap.bg1[level ?? 'DEFAULT'], tw`rounded-2xl shadow`]}>
          <View style={[tw`p-4`, levelColorMap.bg2[level ?? 'DEFAULT'], tw`rounded-t-2xl`]}>
            {!!title && <Text style={tw`h6 text-black-1`}>{title.toLocaleLowerCase()}</Text>}
            {content}
          </View>
          <View style={[tw`px-4 py-1 flex-row`, !!action2 ? tw`justify-between` : tw`justify-center`]}>
            {!!action2 && (
              <Pressable onPress={action2.callback}>
                <View style={[tw`flex flex-row flex-shrink`]}>
                  <Icon id={action2.icon} color={actionColor.color} style={tw`w-4 mr-1`} />
                  <Text style={[tw`text-base leading-relaxed`, actionColor]}>{action2.label}</Text>
                </View>
              </Pressable>
            )}
            {
              <Pressable onPress={action1 ? action1.callback : closeOverlay}>
                <View style={[tw`flex flex-row flex-shrink`]}>
                  <Text style={[tw`text-base leading-relaxed`, actionColor]}>
                    {action1 ? action1.label : i18n('close').toLocaleLowerCase()}
                  </Text>
                  <Icon id={action1 ? action1.icon : 'xSquare'} color={actionColor.color} style={tw`w-4 ml-1`} />
                </View>
              </Pressable>
            }
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default Overlay
