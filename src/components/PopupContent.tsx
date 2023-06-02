import { useEffect } from 'react'
import { BackHandler, Modal, Pressable, View, ViewStyle } from 'react-native'
import { Text } from '.'
import tw from '../styles/tailwind'
import i18n from '../utils/i18n'
import { PopupAction } from './PopupAction'

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
type Props = {
  visible: boolean
  title?: string
  content?: JSX.Element
  action1?: Action
  action2?: Action
  closePopup: () => void
  level?: Level
  requireUserAction?: boolean
}
export const PopupContent = ({
  visible,
  title,
  content,
  action1,
  action2,
  closePopup,
  level = 'DEFAULT',
  requireUserAction,
}: Props) => {
  const actionColor = level === 'WARN' ? tw`text-black-1` : tw`text-primary-background-light`
  const onBackgroundPress = !requireUserAction ? closePopup : null

  useEffect(() => {
    if (!content) return () => {}
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      closePopup()
      return true
    })
    return () => {
      backHandler.remove()
    }
  }, [closePopup, content])

  return (
    <Modal transparent={true} visible={visible}>
      <View style={tw`justify-center flex-1`}>
        <Pressable
          testID="overlay-background"
          style={tw`absolute top-0 left-0 w-full h-full bg-black-1 opacity-40`}
          onPress={onBackgroundPress}
        ></Pressable>
        <View testID="overlay" style={[levelColorMap.bg1[level], tw`mx-6 rounded-2xl`]}>
          <View style={[tw`p-4`, levelColorMap.bg2[level], tw`rounded-t-2xl`]}>
            {!!title && <Text style={tw`mb-1 h5 text-black-1`}>{title.toLocaleLowerCase()}</Text>}
            {content}
          </View>
          <View style={[tw`flex-row px-4`, !!action2 ? tw`justify-between` : tw`justify-center`]}>
            {!!action2 && (
              <PopupAction
                style={tw`py-2`}
                isDisabled={action2?.disabled}
                onPress={!action2.disabled ? action2.callback : null}
                color={actionColor}
                label={action2.label}
                iconId={action2.icon}
                reverseOrder
              />
            )}
            <PopupAction
              style={[tw`py-2`, !action2 && tw`justify-center`]}
              isDisabled={action1?.disabled}
              onPress={action1 ? (!action1.disabled ? action1.callback : null) : closePopup}
              color={actionColor}
              label={action1 ? action1.label : i18n('close')}
              iconId={action1 ? action1.icon : 'xSquare'}
            />
          </View>
        </View>
      </View>
    </Modal>
  )
}
