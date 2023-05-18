import { useMemo } from 'react'
import { View } from 'react-native'
import { PeachScrollView } from '../../../components'
import { HelpIcon } from '../../../components/icons'
import { useHeaderSetup } from '../../../hooks'
import { useSelfUser } from '../../../hooks/query/useSelfUser'
import { useShowHelp } from '../../../hooks/useShowHelp'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { ProfileOverview } from '../../publicProfile/components'
import { TradingLimits } from './TradingLimits'
import { AccountInfo } from './accountInfo/AccountInfo'
import { DeleteAccountButton } from './deleteAccount/DeleteAccountButton'

export default () => {
  const { user, isLoading } = useSelfUser()
  const openTradingLimitsPopup = useShowHelp('tradingLimit')
  useHeaderSetup(
    useMemo(
      () => ({
        title: i18n('settings.myProfile'),
        icons: [{ iconComponent: <HelpIcon />, onPress: openTradingLimitsPopup }],
      }),
      [openTradingLimitsPopup],
    ),
  )
  if (isLoading || !user) return <></>

  return (
    <View style={tw`h-full px-8`}>
      <PeachScrollView>
        <ProfileOverview style={tw`mt-[48.5px] items-start`} user={user} />
        <TradingLimits style={tw`mt-6`} />
        <AccountInfo style={tw`mt-12 ml-1`} user={user} />
        <DeleteAccountButton style={tw`self-center my-7`} />
      </PeachScrollView>
    </View>
  )
}
