import React, { ReactElement } from 'react'
import { View } from 'react-native'

import tw from '../../styles/tailwind'

import { GoBackButton, Headline, Text, Title } from '../../components'
import { account, updateSettings } from '../../utils/account'
import i18n from '../../utils/i18n'
import { StackNavigation } from '../../utils/navigation'
import ReturnAddress from '../sell/components/ReturnAddress'

type Props = {
  navigation: StackNavigation
}

export default ({ navigation }: Props): ReactElement => {
  const setReturnAddress = (address: string) => {
    updateSettings(
      {
        returnAddress: address,
      },
      true,
    )
  }

  return (
    <View style={tw`h-full flex items-stretch pt-6 px-6 pb-10`}>
      <Title title={i18n('settings.title')} subtitle={i18n('settings.escrow.subtitle')} />
      <View style={tw`h-full flex-shrink mt-12`}>
        <Headline style={tw`mt-16 text-grey-1`}>{i18n('sell.escrow.returnAddress.title')}</Headline>
        <Text style={tw`text-grey-2 text-center -mt-2`}>{i18n('sell.escrow.returnAddress.subtitle')}</Text>
        <ReturnAddress returnAddress={account.settings.returnAddress} update={setReturnAddress} />
      </View>
      <GoBackButton style={tw`flex items-center mt-16`} />
    </View>
  )
}
