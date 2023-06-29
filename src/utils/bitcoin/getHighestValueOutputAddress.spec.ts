import { bitcoinTransaction } from '../../../tests/unit/data/transactionDetailData'
import { getHighestValueOutputAddress } from './getHighestValueOutputAddress'

describe('getHighestValueOutputAddress', () => {
  it('should get the heighest value output address', () => {
    expect(getHighestValueOutputAddress(bitcoinTransaction)).toBe('bc1p0w3vredacted')
  })
})
