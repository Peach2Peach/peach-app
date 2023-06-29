import { bitcoinTransaction } from '../../../tests/unit/data/transactionDetailData'
import { getReceivingAddress } from './getReceivingAddress'

describe('getReceivingAddress', () => {
  it('should get the receiving address', () => {
    expect(getReceivingAddress(bitcoinTransaction)).toBe('bc1p0w3vredacted')
  })
})
