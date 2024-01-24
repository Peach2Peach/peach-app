import {
  bitcoinJSTransactionWithRBF1,
  bitcoinJSTransactionWithRBF2,
  bitcoinJSTransactionWithoutRBF1,
  bitcoinJSTransactionWithoutRBF2,
} from '../../../tests/unit/data/transactionDetailData'
import { isRBFEnabled } from './isRBFEnabled'

describe('isRBFEnabled', () => {
  it('should return false if RBF is not enabled', () => {
    expect(isRBFEnabled(bitcoinJSTransactionWithoutRBF1)).toBeFalsy()
    expect(isRBFEnabled(bitcoinJSTransactionWithoutRBF2)).toBeFalsy()
  })
  it('should return true if RBF is not enabled', () => {
    expect(isRBFEnabled(bitcoinJSTransactionWithRBF1)).toBeTruthy()
    expect(isRBFEnabled(bitcoinJSTransactionWithRBF2)).toBeTruthy()
  })
})
