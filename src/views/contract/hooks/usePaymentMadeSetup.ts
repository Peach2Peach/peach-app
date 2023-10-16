import { useNavigation, useRoute } from '../../../hooks'

export const usePaymentMadeSetup = () => {
  const route = useRoute<'paymentMade'>()
  const navigation = useNavigation()
  const { contractId } = route.params
  const goToTrade = () =>
    navigation.reset({
      index: 1,
      routes: [{ name: 'yourTrades' }, { name: 'contract', params: { contractId } }],
    })
  const close = () => (navigation.canGoBack() ? navigation.goBack() : navigation.navigate('buy'))

  return { close, goToTrade }
}
