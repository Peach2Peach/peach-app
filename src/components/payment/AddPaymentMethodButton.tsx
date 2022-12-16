import React, { ReactElement } from 'react'
import { Pressable, View } from 'react-native'
import { Icon, Text } from '../'
import { useNavigation } from '../../hooks'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

type AddPaymentMethodProps = ComponentProps & {
  origin: [keyof RootStackParamList, RootStackParamList[keyof RootStackParamList]]
}

export default ({ origin, style }: AddPaymentMethodProps): ReactElement => {
  const navigation = useNavigation()
  const addPaymentMethods = () => {
    navigation.push('addPaymentMethod', { origin })
  }

  return (
    <View style={style}>
      <View style={tw`flex items-center`}>
        <Pressable testID="buy-add-mop" onPress={addPaymentMethods} style={tw`flex flex-row items-center`}>
          <Text style={tw`h6 text-primary-main`}>{i18n('paymentMethod.select')}</Text>
          <Icon id="plusCircle" style={tw`w-5 h-5 ml-2`} color={tw`text-primary-main`.color} />
        </Pressable>
      </View>
    </View>
  )
}
