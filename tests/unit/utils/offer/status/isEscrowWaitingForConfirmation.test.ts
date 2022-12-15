import { ok } from 'assert'
import { isEscrowWaitingForConfirmation } from '../../../../../src/utils/offer/status'
import { sellOffer } from '../../../data/offerData'

describe('isEscrowWaitingForConfirmation', () => {
  it('should check if escrow is waiting to be confirmed', () => {
    ok(
      isEscrowWaitingForConfirmation({
        ...sellOffer,
        escrow: 'escrow',
        funding: {
          ...sellOffer.funding,
          status: 'NULL',
        },
      }),
    )
    ok(
      isEscrowWaitingForConfirmation({
        ...sellOffer,
        escrow: 'escrow',
        funding: {
          ...sellOffer.funding,
          status: 'MEMPOOL',
        },
      }),
    )
    ok(
      !isEscrowWaitingForConfirmation({
        ...sellOffer,
        escrow: undefined,
        funding: {
          ...sellOffer.funding,
          status: 'NULL',
        },
      }),
    )
    ok(
      !isEscrowWaitingForConfirmation({
        ...sellOffer,
        escrow: 'escrow',
        funding: {
          ...sellOffer.funding,
          status: 'FUNDED',
        },
      }),
    )
    ok(
      !isEscrowWaitingForConfirmation({
        ...sellOffer,
        escrow: 'escrow',
        funding: {
          ...sellOffer.funding,
          status: 'CANCELED',
        },
      }),
    )
    ok(
      !isEscrowWaitingForConfirmation({
        ...sellOffer,
        escrow: 'escrow',
        funding: {
          ...sellOffer.funding,
          status: 'WRONG_FUNDING_AMOUNT',
        },
      }),
    )
  })
})
