import { ReactElement } from 'react'
import { View } from 'react-native'

import tw from '../../styles/tailwind'

import { Icon, PrimaryButton, Text } from '../../components'
import i18n from '../../utils/i18n'
import { usePaymentMadeSetup } from './hooks/usePaymentMadeSetup'

export default (): ReactElement => {
  const { goToTrade, close } = usePaymentMadeSetup()

  return (
    <View style={tw`items-center justify-between h-full px-6 pb-7`}>
      <View style={tw`justify-center flex-shrink w-full h-full`}>
        <Text style={tw`text-center h4 text-primary-background-light`}>{i18n('contract.paymentMade.title')}</Text>
        <View style={tw`flex-row items-center mt-8`}>
          <Icon
            id="dollarSignCircleInverted"
            style={tw`mr-6 w-23 h-23`}
            color={tw`text-primary-background-light`.color}
          />
          <Text style={tw`flex-shrink body-l text-primary-background-light`}>
            {i18n('contract.paymentMade.description')}
          </Text>
        </View>
      </View>
      <PrimaryButton white narrow onPress={goToTrade}>
        {i18n('goToTrade')}
      </PrimaryButton>
      <PrimaryButton style={tw`mt-3`} border white narrow onPress={close}>
        {i18n('close')}
      </PrimaryButton>
    </View>
  )
}
