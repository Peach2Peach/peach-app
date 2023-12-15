import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { MeansOfPayment } from '../../../../peach-api/src/@types/payment'
import { MSINAMINUTE } from '../../../constants'
import { round } from '../../../utils/math/round'
import { peachAPI } from '../../../utils/peachAPI'
import { isDefined } from '../../../utils/validation/isDefined'

type Params = {
  type: 'bid' | 'ask'
  meansOfPayment?: MeansOfPayment
  maxPremium?: number
  minReputation?: number
  buyAmountRange?: [number, number]
  sellAmount?: number
}

export function useFilteredMarketStats ({
  type,
  meansOfPayment,
  maxPremium,
  minReputation,
  buyAmountRange,
  sellAmount,
}: Params) {
  const queryData = useQuery({
    queryKey: ['offer', 'search', 'summary', { type, meansOfPayment, maxPremium, minReputation }] as const,
    queryFn: async ({ queryKey }) => {
      const [, , , requestBody] = queryKey
      const { result } = await peachAPI.private.offer.searchOfferSummaries(requestBody)
      return result
    },
    keepPreviousData: true,
    staleTime: MSINAMINUTE,
  })

  const offersWithinRange = useMemo(() => {
    if (!queryData.data?.offers) return []
    if (type === 'bid' && sellAmount) {
      return queryData.data.offers.filter(
        (offer) =>
          'amount' in offer
          && typeof offer.amount !== 'number'
          && offer.amount[0] <= sellAmount
          && offer.amount[1] >= sellAmount,
      )
    } else if (type === 'ask' && buyAmountRange) {
      const [min, max] = buyAmountRange
      return queryData.data.offers.filter(
        (offer) => 'amount' in offer && typeof offer.amount === 'number' && offer.amount >= min && offer.amount <= max,
      )
    }
    return queryData.data.offers
  }, [buyAmountRange, queryData?.data?.offers, sellAmount, type])

  const averagePremium = useMemo(() => {
    const premiums = offersWithinRange.map((offer) => ('premium' in offer ? offer.premium : undefined)).filter(isDefined)
    const avg = premiums.reduce((a, b) => a + b, 0) / premiums.length
    return round(avg, 2)
  }, [offersWithinRange])

  return { ...queryData, data: { ...queryData.data, offersWithinRange, averagePremium } }
}
