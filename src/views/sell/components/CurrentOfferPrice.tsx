import { Text } from '../../../components'
import { useMarketPrices } from '../../../hooks'
import { useOfferPreferences } from '../../../store/offerPreferenes'
import { useSettingsStore } from '../../../store/useSettingsStore'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { getOfferPrice } from '../../../utils/offer'
import { priceFormat } from '../../../utils/string'

const useCurrentOfferPrice = () => {
  const { amount, premium } = useOfferPreferences((state) => ({
    amount: state.sellAmount,
    premium: state.premium,
  }))
  const { data: priceBook, isSuccess } = useMarketPrices()
  const displayCurrency = useSettingsStore((state) => state.displayCurrency)

  return isSuccess ? getOfferPrice(amount, premium, priceBook, displayCurrency) : 0
}

export const CurrentOfferPrice = ({ style }: ComponentProps) => {
  const currentPrice = useCurrentOfferPrice()
  const displayCurrency = useSettingsStore((state) => state.displayCurrency)
  return !!currentPrice ? (
    <Text style={[tw`text-center text-black-2`, style]}>
      ({i18n('sell.premium.currently', `${priceFormat(currentPrice)} ${displayCurrency}`)})
    </Text>
  ) : null
}
