import React, { useMemo } from 'react'
import { View } from 'react-native'
import { Icon, Text } from '../../components'
import { HelpIcon } from '../../components/icons'
import { BigSatsFormat } from '../../components/text'
import { useHeaderSetup } from '../../hooks'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

export default () => {
  useHeaderSetup(
    useMemo(
      () => ({
        title: i18n('wallet.title'),
        icons: [
          { iconComponent: <HelpIcon />, onPress: () => {} },
          { iconComponent: <Icon id="bitcoin" color={tw`text-bitcoin`.color} />, onPress: () => {} },
          { iconComponent: <Icon id="yourTrades" color={tw`text-black-2`.color} />, onPress: () => {} },
        ],
      }),
      [],
    ),
  )

  return (
    <View style={tw`w-full flex flex-col items-center`}>
      <Text style={tw`button-medium`}>{i18n('wallet.totalBalance')}:</Text>
      <BigSatsFormat sats={50000} />
    </View>
  )
}
