import React, { useCallback, useContext, useMemo } from 'react'
import { View } from 'react-native'
import { HelpIcon } from '../../../components/icons'
import { OverlayContext } from '../../../contexts/overlay'
import { useHeaderSetup } from '../../../hooks'
import { useUserQuery } from '../../../hooks/useUserQuery'
import tw from '../../../styles/tailwind'
import { account } from '../../../utils/account'
import i18n from '../../../utils/i18n'
import { AccountInfo } from './accountInfo/AccountInfo'
import { DeleteAccountButton } from './deleteAccount/DeleteAccountButton'
import { MyProfileOverview } from './profileOverview/MyProfileOverview'
import { TradingLimits } from './TradingLimits'

export default () => {
  const [, updateOverlay] = useContext(OverlayContext)
  const openTradingLimitsPopup = useCallback(() => {
    updateOverlay({ content: null, visible: false })
  }, [updateOverlay])
  useHeaderSetup(
    useMemo(
      () => ({
        title: i18n('settings.myProfile'),
        icons: [{ iconComponent: <HelpIcon />, onPress: openTradingLimitsPopup }],
      }),
      [openTradingLimitsPopup],
    ),
  )

  const { user, isLoading } = useUserQuery(account.publicKey)
  if (isLoading || !user) return null

  return (
    <View style={tw`px-8 h-full`}>
      <MyProfileOverview style={tw`mt-[48.5px]`} />
      <TradingLimits style={tw`mt-6`} />
      <AccountInfo style={tw`ml-1`} user={user} />
      <DeleteAccountButton style={tw`self-center absolute bottom-4`} />
    </View>
  )
}
