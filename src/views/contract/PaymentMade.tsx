import { View } from 'react-native'

import tw from '../../styles/tailwind'

import { Icon, Screen, Text } from '../../components'
import { Button } from '../../components/buttons/Button'
import { useNavigation, useRoute } from '../../hooks'
import i18n from '../../utils/i18n'

export const PaymentMade = () => {
  const { contractId } = useRoute<'paymentMade'>().params
  const navigation = useNavigation()
  const goToTrade = () =>
    navigation.reset({
      index: 1,
      routes: [{ name: 'yourTrades' }, { name: 'contract', params: { contractId } }],
    })
  const close = () => (navigation.canGoBack() ? navigation.goBack() : navigation.navigate('buy'))

  return (
    <Screen gradientBackground>
      <View style={tw`grow`}>
        <View style={tw`justify-center gap-8 grow`}>
          <Text style={tw`text-center h4 text-primary-background-light shrink`}>
            {i18n('contract.paymentMade.title')}
          </Text>
          <View style={tw`flex-row items-center gap-6`}>
            <Icon id="dollarSignCircleInverted" size={92} color={tw`text-primary-background-light`.color} />
            <Text style={tw`flex-1 body-l text-primary-background-light`}>
              {i18n('contract.paymentMade.description')}
            </Text>
          </View>
        </View>

        <View style={tw`self-center gap-3`}>
          <Button style={tw`bg-primary-background-light`} textColor={tw`text-primary-main`} onPress={goToTrade}>
            {i18n('goToTrade')}
          </Button>
          <Button onPress={close} ghost>
            {i18n('close')}
          </Button>
        </View>
      </View>
    </Screen>
  )
}
