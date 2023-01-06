import React, { useCallback, useContext, useMemo } from 'react'
import { View } from 'react-native'
import { HelpIcon } from '../../../components/icons'
import { OverlayContext } from '../../../contexts/overlay'
import { useHeaderSetup } from '../../../hooks'
import { useShowHelp } from '../../../hooks/useShowHelp'
import { useUserQuery } from '../../../hooks/useUserQuery'
import { TradingLimit } from '../../../overlays/info/TradingLimit'
import tw from '../../../styles/tailwind'
import { account } from '../../../utils/account'
import i18n from '../../../utils/i18n'
import { AccountInfo } from './accountInfo/AccountInfo'
import { DeleteAccountButton } from './deleteAccount/DeleteAccountButton'
import { MyProfileOverview } from './profileOverview/MyProfileOverview'
import { TradingLimits } from './TradingLimits'

export default () => {
  const { user, isLoading } = useUserQuery(account.publicKey)
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
    <View style={tw`px-8 h-full`}>
      <MyProfileOverview style={tw`mt-[48.5px]`} />
      <TradingLimits style={tw`mt-6`} />
      <AccountInfo style={tw`ml-1`} user={user} />
      <DeleteAccountButton style={tw`self-center absolute bottom-4`} />
    </View>
  )
}
