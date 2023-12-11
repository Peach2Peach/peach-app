import { InfiniteData } from '@tanstack/react-query'
import { GetMatchesResponseBody } from '../../../../peach-api/src/@types/api/offerAPI'

export const updateMatchedStatus = (
  isMatched: boolean,
  oldQueryData: InfiniteData<GetMatchesResponseBody> | undefined,
  matchingOfferId: string,
  offer: BuyOffer | SellOffer,
  currentPage: number,
  // eslint-disable-next-line max-params
) => {
  if (oldQueryData) {
    const matches = oldQueryData.pages[currentPage]?.matches || []
    const newMatches = matches.map((m) => ({
      ...m,
      matched: m.offerId === matchingOfferId ? isMatched : m.matched,
    }))

    return {
      ...oldQueryData,
      pages: oldQueryData.pages.map((page, i) => (i === currentPage ? { ...page, matches: newMatches } : page)),
    }
  }
  return oldQueryData
}
