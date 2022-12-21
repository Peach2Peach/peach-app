import { MatchSelectors } from './createMatchSelectors'

export const updateMatchSelectors = (matchSelectors: MatchSelectors, newMatchSelectors: MatchSelectors) => {
  const updatedMatchSelectors = Object.keys(matchSelectors).reduce((acc: MatchSelectors, matchId) => {
    if (newMatchSelectors[matchId]) {
      acc[matchId] = {
        ...matchSelectors[matchId],
        meansOfPayment: newMatchSelectors[matchId].meansOfPayment,
      }
    }
    return acc
  }, {})
  return updatedMatchSelectors
}
