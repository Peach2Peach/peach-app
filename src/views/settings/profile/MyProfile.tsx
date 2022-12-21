import React from 'react'
import { View } from 'react-native'
import { useHeaderSetup } from '../../../hooks'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { AccountInfo } from './AccountInfo'
import { DeleteAccountButton } from './DeleteAccountButton'
import { ProfileOverview } from './ProfileOverview'
import { TradingLimits } from './TradingLimits'

export default () => {
  useHeaderSetup({ title: i18n('settings.myProfile') })

  return (
    <View>
      <ProfileOverview />
      <TradingLimits />
      <AccountInfo />
      <DeleteAccountButton style={tw`self-center mb-4`} />
    </View>
  )
}
