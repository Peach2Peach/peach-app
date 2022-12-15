import { ok } from 'assert'
import { hasSeenAllMatches } from '../../../../../src/utils/offer/status'
import { sellOffer } from '../../../data/offerData'

describe('hasSeenAllMatches', () => {
  it('should check if offer has seen all matches', () => {
    ok(
      hasSeenAllMatches({
        ...sellOffer,
        matches: ['1', '2'],
        seenMatches: ['1', '2'],
      }),
    )
    ok(
      hasSeenAllMatches({
        ...sellOffer,
        matches: ['1', '2'],
        seenMatches: ['2', '1'],
      }),
    )
    ok(
      hasSeenAllMatches({
        ...sellOffer,
        matches: [],
        seenMatches: [],
      }),
    )
    ok(
      hasSeenAllMatches({
        ...sellOffer,
        matches: [],
        seenMatches: ['1', '2'],
      }),
    )
    ok(
      !hasSeenAllMatches({
        ...sellOffer,
        matches: ['1', '2'],
        seenMatches: [],
      }),
    )
    ok(
      !hasSeenAllMatches({
        ...sellOffer,
        matches: ['1', '2'],
        seenMatches: ['1'],
      }),
    )
    ok(
      !hasSeenAllMatches({
        ...sellOffer,
        matches: ['1', '2'],
        seenMatches: ['2'],
      }),
    )
  })
})
