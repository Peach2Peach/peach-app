import { useCallback } from 'react'
import { View } from 'react-native'
import { Header } from '../../../components/Header'
import { PeachScrollView } from '../../../components/PeachScrollView'
import { ProfileInfo } from '../../../components/ProfileInfo'
import { Screen } from '../../../components/Screen'
import { useSetPopup } from '../../../components/popup/Popup'
import { PopupAction } from '../../../components/popup/PopupAction'
import { TouchableRedText } from '../../../components/text/TouchableRedText'
import { useSelfUser } from '../../../hooks/query/useSelfUser'
import { useShowHelp } from '../../../hooks/useShowHelp'
import { ErrorPopup } from '../../../popups/ErrorPopup'
import { ClosePopupAction } from '../../../popups/actions/ClosePopupAction'
import tw from '../../../styles/tailwind'
import { useAccountStore } from '../../../utils/account/account'
import { deleteAccount } from '../../../utils/account/deleteAccount'
import i18n from '../../../utils/i18n'
import { headerIcons } from '../../../utils/layout/headerIcons'
import { peachAPI } from '../../../utils/peachAPI'
import { TradingLimits } from './TradingLimits'
import { AccountInfo } from './accountInfo/AccountInfo'
import { DeleteAccountPopup } from './deleteAccount/DeleteAccountPopup'

export const MyProfile = () => {
  const { user, isLoading } = useSelfUser()
  const openTradingLimitsPopup = useShowHelp('tradingLimit')
  if (isLoading || !user) return <></>

  return (
    <Screen
      header={
        <Header title={i18n('settings.myProfile')} icons={[{ ...headerIcons.help, onPress: openTradingLimitsPopup }]} />
      }
    >
      <PeachScrollView contentContainerStyle={tw`grow`} contentStyle={tw`justify-between grow gap-7`}>
        <View style={tw`gap-12`}>
          <View style={tw`gap-6`}>
            <ProfileInfo user={user} />
            <TradingLimits />
          </View>
          <AccountInfo user={user} />
        </View>
        <DeleteAccountButton style={tw`self-center`} />
      </PeachScrollView>
    </Screen>
  )
}

function DeleteAccountButton ({ style }: ComponentProps) {
  const setPopup = useSetPopup()
  const setIsLoggedIn = useAccountStore((state) => state.setIsLoggedIn)

  const showPopup = useCallback(
    (content: JSX.Element, callback?: () => void, isSuccess = false) =>
      setPopup(
        <ErrorPopup
          title={i18n(`settings.deleteAccount.${isSuccess ? 'success' : 'popup'}.title`)}
          content={content}
          actions={
            <>
              {!isSuccess && callback && (
                <PopupAction label={i18n('settings.deleteAccount')} iconId="trash" onPress={callback} />
              )}
              <ClosePopupAction reverseOrder style={!(!isSuccess && callback) && tw`justify-center`} />
            </>
          }
        />,
      ),
    [setPopup],
  )

  const deleteAccountClicked = () => {
    deleteAccount()
    peachAPI.private.user.logoutUser()
    setIsLoggedIn(false)
    showPopup(<DeleteAccountPopup title={'success'} />, undefined, true)
  }

  const showForRealsiesPopup = () => {
    showPopup(<DeleteAccountPopup title={'forRealsies'} />, deleteAccountClicked)
  }
  const showDeleteAccountPopup = () => {
    showPopup(<DeleteAccountPopup title={'popup'} />, showForRealsiesPopup)
  }

  return (
    <TouchableRedText onPress={showDeleteAccountPopup} style={style} iconId="trash">
      {i18n('settings.deleteAccount')}
    </TouchableRedText>
  )
}
