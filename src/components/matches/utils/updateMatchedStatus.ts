import { InfiniteData } from '@tanstack/react-query'

export const updateMatchedStatus = (
  isMatched: boolean,
  oldQueryData: InfiniteData<GetMatchesResponse> | undefined,
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
