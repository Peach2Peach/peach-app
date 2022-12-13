import React, { ReactElement } from 'react'
import { View } from 'react-native'

import tw from '../../styles/tailwind'

import { Button, Headline, Text, Title } from '../../components'
import i18n from '../../utils/i18n'
import { StackNavigation } from '../../utils/navigation'
import ReturnAddress from '../sell/components/ReturnAddress'
import { useUserDataStore } from '../../store'

type Props = {
  navigation: StackNavigation
}

export default ({ navigation }: Props): ReactElement => {
  const updateSettings = useUserDataStore((state) => state.updateSettings)
  const returnAddress = useUserDataStore((state) => state.settings.returnAddress)

  const update = (address: string) => {
    updateSettings({
      returnAddress: address,
    })
  }

  return (
    <View style={tw`h-full flex items-stretch pt-6 px-6 pb-10`}>
      <Title title={i18n('settings.title')} subtitle={i18n('settings.escrow.subtitle')} />
      <View style={tw`h-full flex-shrink mt-12`}>
        <Headline style={tw`mt-16 text-grey-1`}>{i18n('sell.escrow.returnAddress.title')}</Headline>
        <Text style={tw`text-grey-2 text-center -mt-2`}>{i18n('sell.escrow.returnAddress.subtitle')}</Text>
        <ReturnAddress {...{ update, returnAddress }} />
      </View>
      <View style={tw`flex items-center mt-16`}>
        <Button title={i18n('back')} wide={false} secondary={true} onPress={navigation.goBack} />
      </View>
    </View>
  )
}
