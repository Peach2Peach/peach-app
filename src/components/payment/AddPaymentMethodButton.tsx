import React, { ReactElement } from 'react'
import { Pressable, View } from 'react-native'
import { Icon, Text } from '../'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { StackNavigation } from '../../utils/navigation'


type AddPaymentMethodProps = ComponentProps & {
  navigation: StackNavigation,
  origin: [keyof RootStackParamList, RootStackParamList[keyof RootStackParamList]],
}

export default ({ navigation, origin, style }: AddPaymentMethodProps): ReactElement => {
  const addPaymentMethods = () => {
    navigation.push('addPaymentMethod', { origin })
  }

  return <View style={style}>
    <View style={tw`flex items-center`}>
      <Pressable testID="buy-add-mop" onPress={addPaymentMethods} style={tw`flex flex-row items-center`}>
        <Icon id="plus" style={tw`w-7 h-7 mr-2`} color={tw`text-peach-1`.color as string} />
        <Text style={tw`text-peach-1 font-baloo text-sm`}>{i18n('paymentMethod.select')}</Text>
      </Pressable>
    </View>
  </View>
}