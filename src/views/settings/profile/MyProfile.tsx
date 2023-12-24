import { useCallback } from 'react'
import { View } from 'react-native'
import { Header } from '../../../components/Header'
import { PeachScrollView } from '../../../components/PeachScrollView'
import { ProfileInfo } from '../../../components/ProfileInfo'
import { Screen } from '../../../components/Screen'
import { useSetPopup } from '../../../components/popup/Popup'
import { PopupAction } from '../../../components/popup/PopupAction'
import { PeachText } from '../../../components/text/PeachText'
import { TouchableRedText } from '../../../components/text/TouchableRedText'
import { HelpPopup } from '../../../hooks/HelpPopup'
import { useSelfUser } from '../../../hooks/query/useSelfUser'
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

export const MyProfile = () => {
  const { user, isLoading } = useSelfUser()
  const setPopup = useSetPopup()
  const showHelp = () => setPopup(<HelpPopup id="tradingLimit" />)
  if (isLoading || !user) return <></>

  return (
    <Screen header={<Header title={i18n('settings.myProfile')} icons={[{ ...headerIcons.help, onPress: showHelp }]} />}>
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
    (popupChain = ['popup', 'forRealsies', 'success']) => {
      const title = popupChain[0]
      const isSuccess = popupChain.length === 1
      if (isSuccess) {
        deleteAccount()
        peachAPI.private.user.logoutUser()
        setIsLoggedIn(false)
      }

      const onPress = () => showPopup(popupChain.slice(1))

      setPopup(
        <ErrorPopup
          title={i18n(`settings.deleteAccount.${isSuccess ? 'success' : 'popup'}.title`)}
          content={<PeachText>{i18n(`settings.deleteAccount.${title}`)}</PeachText>}
          actions={
            <>
              {!isSuccess && <PopupAction label={i18n('settings.deleteAccount')} iconId="trash" onPress={onPress} />}
              <ClosePopupAction reverseOrder style={isSuccess && tw`justify-center`} />
            </>
          }
        />,
      )
    },
    [setIsLoggedIn, setPopup],
  )

  return (
    <TouchableRedText onPress={showPopup} style={style} iconId="trash">
      {i18n('settings.deleteAccount')}
    </TouchableRedText>
  )
}
