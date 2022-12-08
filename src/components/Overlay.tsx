import React, { ReactElement, useContext, useEffect, useMemo } from 'react'
import { BackHandler, Modal, Pressable, View, ViewStyle } from 'react-native'
import { Text } from '.'
import { OverlayContext } from '../contexts/overlay'
import tw from '../styles/tailwind'
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

/**
 * @description Component to display the Overlay
 * @param props Component properties
 * @param props.level level of overlay
 * @param props.title title of the overlay
 * @param props.content content of the overlay
 * @param [props.action1] custom action to appear on bottom right corner
 * @param [props.action1Label] label for action1
 * @param [props.action1Icon] optional icon for action1
 * @param [props.action2] custom action to appear on bottom left corner
 * @param [props.action2Label] label for action2
 * @param [props.action2Icon] optional icon for action2
 * @param [props.style] additional styles to apply to the component
 * @param [props.visible] check whether the modal is visible or not
 * @example
 * <Overlay title="popup title" level="ERROR" />
 */

export const Overlay = ({
  title,
  content,
  action1,
  action1Label,
  action1Icon,
  action2,
  action2Icon,
  action2Label,
  level,
  visible,
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
          onPress={closeOverlay}
        ></Pressable>
        <View testID="overlay" style={[tw`m-10`, levelColorMap.bg1[level ?? 'DEFAULT'], tw`rounded-2xl shadow`]}>
          <View style={[tw`p-4`, levelColorMap.bg2[level ?? 'DEFAULT'], tw`rounded-t-2xl`]}>
            {!!title && <Text style={tw`h6 text-black-1`}>{title.toLocaleLowerCase()}</Text>}
            {content}
          </View>
          <View style={[tw`px-4 py-1 flex-row`, !!action2Label ? tw`justify-between` : tw`justify-center`]}>
            {!!action2 && !!action2Label && (
              <Pressable onPress={action2}>
                <View
                  style={[
                    tw`flex flex-row flex-shrink`,
                    level === 'WARN' ? tw`text-black-1` : tw`text-primary-background-light`,
                  ]}
                >
                  <Icon id={action2Icon} color={actionColor.color} style={tw`w-4 mr-1`} />
                  <Text style={[tw`text-base leading-relaxed`, actionColor]}>{action2Label}</Text>
                </View>
              </Pressable>
            )}
            {!!action1 && !!action1Label && (
              <Pressable onPress={action1}>
                <View style={[tw`flex flex-row flex-shrink`]}>
                  <Text style={[tw`text-base leading-relaxed`, actionColor]}>{action1Label}</Text>
                  <Icon id={action1Icon} color={actionColor.color} style={tw`w-4 ml-1`} />
                </View>
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default Overlay
