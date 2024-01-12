import { API_URL } from '@env'
import { View } from 'react-native'
import { WebView, WebViewMessageEvent } from 'react-native-webview'
import { useClosePopup, useSetPopup } from '../../components/popup/Popup'
import { PopupAction } from '../../components/popup/PopupAction'
import { PopupComponent } from '../../components/popup/PopupComponent'
import { ClosePopupAction } from '../../components/popup/actions/ClosePopupAction'
import { initApp } from '../../init/initApp'
import { useSettingsStore } from '../../store/settingsStore/useSettingsStore'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { WarningPopup } from '../WarningPopup'

export const VerifyYouAreAHuman = () => {
  const closePopup = useClosePopup()
  const setCloudflareChallenge = useSettingsStore((state) => state.setCloudflareChallenge)

  const handleMessage = async (event: WebViewMessageEvent) => {
    const cloudflareChallenge = JSON.parse(event.nativeEvent.data)
    setCloudflareChallenge(cloudflareChallenge)
    await initApp()
    closePopup()
  }
  return (
    <PopupComponent
      bgColor={tw`p-0 bg-warning-mild-1`}
      actionBgColor={tw`bg-warning-main`}
      content={
        <View style={tw`h-[450px]`}>
          <WebView contentMode="mobile" onMessage={handleMessage} source={{ uri: `${API_URL}/v1/human/verify` }} />
        </View>
      }
      actions={<ClosePopupAction style={tw`justify-center`} textStyle={tw`text-black-100`} />}
    />
  )
}

export function VerifyYouAreAHumanPopup () {
  return (
    <WarningPopup
      title={i18n('HUMAN_VERIFICATION_REQUIRED.title')}
      content={i18n('HUMAN_VERIFICATION_REQUIRED.text')}
      actions={
        <>
          <ClosePopupAction textStyle={tw`text-black-100`} />
          <GoToChallengeAction />
        </>
      }
    />
  )
}

function GoToChallengeAction () {
  const setPopup = useSetPopup()

  return (
    <PopupAction
      label={i18n('HUMAN_VERIFICATION_REQUIRED.start')}
      textStyle={tw`text-black-100`}
      onPress={() => setPopup(<VerifyYouAreAHuman />)}
      iconId={'user'}
      reverseOrder
    />
  )
}
