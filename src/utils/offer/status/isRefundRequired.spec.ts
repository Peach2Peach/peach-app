import { ok } from 'assert'
import { isRefundRequired } from '.'
import { contract } from '../../../../tests/unit/data/contractData'
import { buyOffer, sellOffer } from '../../../../tests/unit/data/offerData'

// eslint-disable-next-line max-lines-per-function
describe('isRefundRequired', () => {
  // eslint-disable-next-line max-lines-per-function
  it('should check if refunding is required', () => {
    ok(
      isRefundRequired(
        {
          ...sellOffer,
          newOfferId: undefined,
          refunded: false,
        },
        {
          ...contract,
          disputeWinner: 'seller',
          releaseTxId: undefined,
        },
      ),
    )
    ok(
      !isRefundRequired(
        {
          ...buyOffer,
          newOfferId: undefined,
          refunded: false,
        },
        {
          ...contract,
          disputeWinner: 'seller',
          releaseTxId: undefined,
        },
      ),
    )
    ok(
      !isRefundRequired(
        {
          ...sellOffer,
          newOfferId: undefined,
          refunded: false,
        },
        {
          ...contract,
          disputeWinner: 'buyer',
          releaseTxId: undefined,
        },
      ),
    )
    ok(
      !isRefundRequired(
        {
          ...sellOffer,
          newOfferId: '4',
          refunded: false,
        },
        {
          ...contract,
          disputeWinner: 'seller',
          releaseTxId: undefined,
        },
      ),
    )
    ok(
      !isRefundRequired(
        {
          ...sellOffer,
          newOfferId: undefined,
          refunded: true,
        },
        {
          ...contract,
          disputeWinner: 'seller',
          releaseTxId: undefined,
        },
      ),
    )
    ok(
      !isRefundRequired(
        {
          ...sellOffer,
          newOfferId: undefined,
          refunded: false,
        },
        {
          ...contract,
          disputeWinner: 'seller',
          releaseTxId: 'releaseTxId',
        },
      ),
    )
  })
})
