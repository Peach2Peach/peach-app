import { MatchSelectors } from './createMatchSelectors'

/**
 * This function preserves the current state of the matchSelectors while allowing changes to the meansOfPayment.
 * This might not be necessary if we can guarantee that the meansOfPayment will not change.
 * @param matchSelectors the current matchSelectors
 * @param newMatchSelectors the new matchSelectors
 * @returns an updated version of the current matchSelectors
 */
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
