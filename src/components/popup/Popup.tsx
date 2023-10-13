import { Modal, Pressable, View, ViewStyle } from 'react-native'
import { usePopupStore } from '../../store/usePopupStore'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { Text } from '../text'
import { PopupAction } from './DeprecatedPopupAction'

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
    SUCCESS: tw`bg-success-background-main`,
    WARN: tw`bg-warning-background`,
    ERROR: tw`bg-error-background`,
    INFO: tw`bg-info-background`,
  },
}

export const Popup = () => {
  const {
    visible,
    title,
    content,
    action1,
    action2,
    closePopup,
    level = 'DEFAULT',
    requireUserAction,
    popupComponent,
  } = usePopupStore()

  const actionColor = level === 'WARN' ? tw`text-black-1` : tw`text-primary-background-light`
  const onBackgroundPress = !requireUserAction ? closePopup : null

  return (
    <Modal transparent visible={visible} onRequestClose={closePopup}>
      <View style={tw`justify-center flex-1`}>
        <Pressable style={tw`absolute w-full h-full bg-black-1 opacity-40`} onPress={onBackgroundPress} />
        {popupComponent || (
          <View style={[levelColorMap.bg1[level], tw`mx-6 rounded-2xl`]}>
            <View style={[tw`p-4 rounded-t-2xl`, levelColorMap.bg2[level]]}>
              {!!title && <Text style={tw`mb-1 h5 text-black-1`}>{title}</Text>}
              {content}
            </View>
            <View style={[tw`flex-row px-4`, action2 ? tw`justify-between` : tw`justify-center`]}>
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
        )}
      </View>
    </Modal>
  )
}
