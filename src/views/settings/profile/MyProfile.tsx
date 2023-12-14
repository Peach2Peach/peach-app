import { View } from 'react-native'
import { Header } from '../../../components/Header'
import { PeachScrollView } from '../../../components/PeachScrollView'
import { Screen } from '../../../components/Screen'
import { TouchableRedText } from '../../../components/text/TouchableRedText'
import { useSelfUser } from '../../../hooks/query/useSelfUser'
import { useShowHelp } from '../../../hooks/useShowHelp'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { headerIcons } from '../../../utils/layout/headerIcons'
import { ProfileOverview } from '../../publicProfile/components'
import { TradingLimits } from './TradingLimits'
import { AccountInfo } from './accountInfo/AccountInfo'
import { useDeleteAccountPopups } from './deleteAccount/useDeleteAccountPopups'

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
            <ProfileOverview user={user} />
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
  const showDeleteAccountPopup = useDeleteAccountPopups()

  return (
    <TouchableRedText onPress={showDeleteAccountPopup} style={style} iconId="trash">
      {i18n('settings.deleteAccount')}
    </TouchableRedText>
  )
}
