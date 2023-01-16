import React, { useMemo } from 'react'
import { View } from 'react-native'

import { PeachScrollView } from '../../../components'
import { HelpIcon } from '../../../components/icons'
import { useHeaderSetup } from '../../../hooks'
import { useShowHelp } from '../../../hooks/useShowHelp'
import { useUserQuery } from '../../../hooks/useUserQuery'
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
    <View style={tw`h-full px-8`}>
      <PeachScrollView>
        <MyProfileOverview style={tw`mt-[48.5px]`} />
        <TradingLimits style={tw`mt-2`} />
        <AccountInfo style={tw`mt-12 ml-1`} user={user} />
        <DeleteAccountButton style={tw`self-center my-7`} />
      </PeachScrollView>
    </View>
  )
}
