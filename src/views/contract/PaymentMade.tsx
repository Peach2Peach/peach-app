import tw from '../../styles/tailwind'

import { Overlay } from '../../components/Overlay'
import { Button } from '../../components/buttons/Button'
import { useNavigation, useRoute } from '../../hooks'
import i18n from '../../utils/i18n'

export const PaymentMade = () => {
  const { contractId } = useRoute<'paymentMade'>().params
  const navigation = useNavigation()
  const goToTrade = () =>
    navigation.reset({
      index: 1,
      routes: [
        { name: 'homeScreen', params: { screen: 'yourTrades' } },
        { name: 'contract', params: { contractId } },
      ],
    })
  const close = () =>
    navigation.canGoBack() ? navigation.goBack() : navigation.navigate('homeScreen', { screen: 'buy' })

  return (
    <Overlay
      title={i18n('contract.paymentMade.title')}
      text={i18n('contract.paymentMade.description')}
      iconId="dollarSignCircleInverted"
      buttons={
        <>
          <Button style={tw`bg-primary-background-light`} textColor={tw`text-primary-main`} onPress={goToTrade}>
            {i18n('goToTrade')}
          </Button>
          <Button onPress={close} ghost>
            {i18n('close')}
          </Button>
        </>
      }
    />
  )
}
