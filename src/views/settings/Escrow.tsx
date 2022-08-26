import React, { ReactElement } from 'react'
import { View } from 'react-native'

import tw from '../../styles/tailwind'

import { Button, Title } from '../../components'
import { account, updateSettings } from '../../utils/account'
import i18n from '../../utils/i18n'
import { StackNavigation } from '../../utils/navigation'
import ReturnAddress from '../sell/components/ReturnAddress'

type Props = {
  navigation: StackNavigation;
}

export default ({ navigation }: Props): ReactElement => {
  const setReturnAddress = (address: string) => {
    // if (isxpub(address)) {
    //   updateSettings({
    //     returnAddress: address,
    //     derivationPath: `m/84'/${NETWORK === 'bitcoin' ? '0' : '1'}'/0'`,
    //     hdStartIndex: 0
    //   })
    // } else {
    updateSettings({
      returnAddress: address
    }, true)
  }

  return <View style={tw`h-full flex items-stretch pt-6 px-6 pb-10`}>
    <Title title={i18n('settings.title')} subtitle={i18n('settings.escrow.subtitle')} />
    <View style={tw`h-full flex-shrink mt-12`}>
      <ReturnAddress style={tw`mt-16`} returnAddress={account.settings.returnAddress} update={setReturnAddress}/>
    </View>
    <View style={tw`flex items-center mt-16`}>
      <Button
        title={i18n('back')}
        wide={false}
        secondary={true}
        onPress={navigation.goBack}
      />
    </View>
  </View>
}

