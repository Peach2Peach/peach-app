import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { Icon, Text } from '../components'
import tw from '../styles/tailwind'
import i18n from '../utils/i18n'

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

const CurrenciesHelp = (
  <View>
    <Text>{i18n('help.paymentMethods.description.1')}</Text>
    <View style={tw`flex-row`}>
      <Text>{i18n('help.paymentMethods.description.2')}</Text>
      <Icon id="userCheck" />
    </View>
  </View>
)

type HelpContent = {
  title: Record<HelpType, string>
  content: Record<HelpType, ReactElement>
}

const helpOverlays: HelpContent = {
  title: {
    paymentMethods: i18n('settings.paymentMethods'),
    currencies: i18n('settings.currencies'), // TODO
  },
  content: {
    paymentMethods: PaymentMethodsHelp,
    currencies: CurrenciesHelp, // TODO
  },
}

export const showHelp = (updateOverlay: Function, id: HelpType) => {
  const goToHelp = () => {} // TODO

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
