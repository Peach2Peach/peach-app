import { SATSINBTC } from '../../../constants'
import { useMarketPrices } from '../../../hooks'
import { getAvailableCurrencies } from '../../../utils/match/getAvailableCurrencies'
import { round } from '../../../utils/math/round'
import { getMoPsInCommon, hasMoPsInCommon } from '../../../utils/paymentMethod'
import { useMatchStore } from '../store'
import { getMatchPrice } from '../utils'

export const useMatchPriceData = (match: Match, offer: BuyOffer | SellOffer) => {
  const mopsInCommon = hasMoPsInCommon(offer.meansOfPayment, match.meansOfPayment)
    ? getMoPsInCommon(offer.meansOfPayment, match.meansOfPayment)
    : match.meansOfPayment

  const selectedCurrency
    = useMatchStore(
      (state) =>
        state.matchSelectors[match.offerId]?.selectedCurrency
        || state.matchSelectors[match.offerId]?.availableCurrencies[0],
    ) || getAvailableCurrencies(mopsInCommon, match.meansOfPayment)[0]

  const selectedPaymentMethod = useMatchStore((state) => state.matchSelectors[match.offerId]?.selectedPaymentMethod)

  const { data: priceBook, isSuccess } = useMarketPrices()

  const amountInBTC = match.amount / SATSINBTC
  const displayPrice = getMatchPrice(match, selectedPaymentMethod, selectedCurrency)

  const bitcoinPrice = priceBook?.[selectedCurrency] ?? amountInBTC / displayPrice

  const marketPrice = amountInBTC * bitcoinPrice

  const premium = match.matched ? (isSuccess ? round((displayPrice / marketPrice - 1) * 100, 2) : 0) : match.premium

  return { displayPrice, premium, selectedCurrency }
}
