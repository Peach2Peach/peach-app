import React, { ReactElement, useContext } from 'react'
import { Pressable, View } from 'react-native'
import { Icon, Text } from '../'
import { DrawerContext } from '../../contexts/drawer'
import { useNavigation } from '../../hooks'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

type AddPaymentMethodProps = ComponentProps & {
  origin: [keyof RootStackParamList, RootStackParamList[keyof RootStackParamList]]
}

export default ({ origin, style }: AddPaymentMethodProps): ReactElement => {
  const navigation = useNavigation()
  const [, updateDrawer] = useContext(DrawerContext)
  const addPaymentMethods = () => {
    navigation.push('addPaymentMethod', { origin })
  }

  const addCashPaymentMethods = () => {
    updateDrawer({
      title: i18n('paymentCategory'),
      content: <View></View>,
      previousDrawer: {
        title: i18n('holi'),
        content: <View></View>,
        show: true,
        onClose: () => {},
      },
      show: true,
      onClose: () => {},
    })
  }

  return (
    <View style={style}>
      <View style={tw`flex items-center`}>
        <Pressable testID="buy-add-mop" onPress={addCashPaymentMethods} style={tw`flex flex-row items-center`}>
          <Icon id="plusCircle" style={tw`mr-3 w-7 h-7`} color={tw`text-primary-main`.color} />
          <Text style={tw`h6 text-primary-main`}>{i18n('paymentMethod.select.button')}</Text>
        </Pressable>
      </View>
    </View>
  )
}
