import { useHeaderSetup, useNavigation, useRoute } from '../../../hooks'

export const usePaymentMadeSetup = () => {
  const route = useRoute<'paymentMade'>()
  const navigation = useNavigation()
  const { contractId } = route.params
  const goToTrade = () => navigation.replace('contract', { contractId })
  const close = () => (navigation.canGoBack() ? navigation.goBack() : navigation.navigate('home'))

  useHeaderSetup({})
  return { close, goToTrade }
}
