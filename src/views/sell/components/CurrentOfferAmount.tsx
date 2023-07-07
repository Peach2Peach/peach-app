import { BTCAmount } from '../../../components/bitcoin'
import { useOfferPreferences } from '../../../store/offerPreferenes'

export const CurrentOfferAmount = () => {
  const amount = useOfferPreferences((state) => state.sellAmount)

  return <BTCAmount size="small" amount={amount} />
}
