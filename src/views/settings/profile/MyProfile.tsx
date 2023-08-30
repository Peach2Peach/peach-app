import { View } from 'react-native'
import { NewHeader as Header, PeachScrollView, Screen } from '../../../components'
import { useSelfUser } from '../../../hooks/query/useSelfUser'
import { useShowHelp } from '../../../hooks/useShowHelp'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { headerIcons } from '../../../utils/layout/headerIcons'
import { ProfileOverview } from '../../publicProfile/components'
import { TradingLimits } from './TradingLimits'
import { AccountInfo } from './accountInfo/AccountInfo'
import { DeleteAccountButton } from './deleteAccount/DeleteAccountButton'

export const MyProfile = () => {
  const { user, isLoading } = useSelfUser()
  const openTradingLimitsPopup = useShowHelp('tradingLimit')
  if (isLoading || !user) return <></>

  return (
    <Screen>
      <Header title={i18n('settings.myProfile')} icons={[{ ...headerIcons.help, onPress: openTradingLimitsPopup }]} />
      <PeachScrollView contentContainerStyle={[tw`pt-sm`, tw.md`pt-md`]} contentStyle={tw`gap-7`}>
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
