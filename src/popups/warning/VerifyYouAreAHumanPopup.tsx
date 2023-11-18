import { API_URL } from '@env'
import { View } from 'react-native'
import { WebView, WebViewMessageEvent } from 'react-native-webview'
import { Text } from '../../components'
import { PopupAction } from '../../components/popup'
import { PopupComponent } from '../../components/popup/PopupComponent'
import { initApp } from '../../init/initApp'
import { useSettingsStore } from '../../store/settingsStore'
import { usePopupStore } from '../../store/usePopupStore'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { WarningPopup } from '../WarningPopup'
import { ClosePopupAction } from '../actions'

export const VerifyYouAreAHuman = () => {
  const closePopup = usePopupStore((state) => state.closePopup)
  const setCloudflareChallenge = useSettingsStore((state) => state.setCloudflareChallenge)

  const handleMessage = async (event: WebViewMessageEvent) => {
    const cloudflareChallenge = JSON.parse(event.nativeEvent.data)
    setCloudflareChallenge(cloudflareChallenge)
    await initApp()
    closePopup()
  }
  return (
    <PopupComponent
      bgColor={tw`p-0 bg-warning-background`}
      actionBgColor={tw`bg-warning-main`}
      content={
        <View style={tw`h-[450px]`}>
          <WebView contentMode="mobile" onMessage={handleMessage} source={{ uri: `${API_URL}/v1/human/verify` }} />
        </View>
      }
      actions={<ClosePopupAction style={tw`justify-center`} textStyle={tw`text-black-1`} />}
    />
  )
}

export function VerifyYouAreAHumanPopup () {
  return (
    <WarningPopup
      title={i18n('HUMAN_VERIFICATION_REQUIRED.title')}
      content={<Text>{i18n('HUMAN_VERIFICATION_REQUIRED.text')}</Text>}
      actions={
        <>
          <ClosePopupAction textStyle={tw`text-black-1`} />
          <GoToChallengeAction />
        </>
      }
    />
  )
}

function GoToChallengeAction () {
  const setPopup = usePopupStore((state) => state.setPopup)

  return (
    <PopupAction
      label={i18n('HUMAN_VERIFICATION_REQUIRED.start')}
      textStyle={tw`text-black-1`}
      onPress={() => setPopup(<VerifyYouAreAHuman />)}
      iconId={'user'}
      reverseOrder
    />
  )
}
