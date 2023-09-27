import { Linking } from 'react-native'
import { PopupAction } from '../../components/popup'
import { PopupComponent } from '../../components/popup/PopupComponent'
import { Text } from '../../components/text'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { ClosePopupAction } from '../actions'

const MissingPermissionsContent = () => <Text>{i18n('settings.missingPermissions.text')}</Text>
const OpenSettingsAction = () => (
  <PopupAction
    label={'open settings'}
    textStyle={tw`text-black-1`}
    onPress={Linking.openSettings}
    iconId={'settingsGear'}
    reverseOrder
  />
)

export const MissingPermissionsPopup = () => (
  <PopupComponent
    title={i18n('settings.missingPermissions')}
    content={<MissingPermissionsContent />}
    actions={
      <>
        <ClosePopupAction textStyle={tw`text-black-1`} />
        <OpenSettingsAction />
      </>
    }
    bgColor={tw`bg-warning-background`}
    actionBgColor={tw`bg-warning-main`}
  />
)
