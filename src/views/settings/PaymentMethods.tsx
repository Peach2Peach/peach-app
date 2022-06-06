import React, { ReactElement, useState } from 'react'
import { View } from 'react-native'

import tw from '../../styles/tailwind'
import { StackNavigationProp } from '@react-navigation/stack'

import { Button, Title } from '../../components'
import i18n from '../../utils/i18n'
import { AllPaymentMethods } from './components/AllPaymentMethods'


type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'contact'>

type Props = {
  navigation: ProfileScreenNavigationProp;
}

export default ({ navigation }: Props): ReactElement => {
  const [update, setUpdate] = useState(0)
  const dummy = () => setUpdate(Math.random())
  return <View style={tw`h-full flex items-stretch pt-6 px-6 pb-10`}>
    <Title title={i18n('settings.title')} subtitle={i18n('settings.paymentMethods.subtitle')} />
    <View style={tw`h-full flex-shrink mt-12`}>
      <AllPaymentMethods onChange={dummy} />
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

