import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { Icon, Text } from '../components'
import tw from '../styles/tailwind'
import i18n from '../utils/i18n'
import { StackNavigation } from '../utils/navigation'

const PaymentMethodsHelp = (
  <>
    <Text>{i18n('help.paymentMethods.description.1')}</Text>
    <View style={tw`flex-row mt-2 items-center`}>
      <View style={tw`flex-shrink`}>
        <Text>{i18n('help.paymentMethods.description.2')}</Text>
      </View>
      <Icon style={tw`w-7 h-7 mx-3`} id="userCheck" color={tw`text-black-1`.color} />
    </View>
  </>
)

const CurrenciesHelp = <Text>{i18n('help.currency.description')}</Text>

type HelpContent = {
  title: Record<HelpType, string>
  content: Record<HelpType, ReactElement>
}

const helpOverlays: HelpContent = {
  title: {
    paymentMethods: i18n('settings.paymentMethods'),
    currencies: i18n('help.currency.title'),
  },
  content: {
    paymentMethods: PaymentMethodsHelp,
    currencies: CurrenciesHelp,
  },
}

export const showHelp = (updateOverlay: Function, id: HelpType, navigation: StackNavigation) => {
  const goToHelp = () => {
    updateOverlay({
      visible: false,
    })
    navigation.navigate('contact')
  }

  updateOverlay({
    title: helpOverlays.title[id],
    content: helpOverlays.content[id],
    visible: true,
    action2: {
      callback: goToHelp,
      label: i18n('help'),
      icon: 'info',
    },
    level: 'INFO',
  })
}
