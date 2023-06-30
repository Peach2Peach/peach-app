import {
  transactionWithRBF1,
  transactionWithRBF2,
  transactionWithoutRBF1,
  transactionWithoutRBF2,
} from '../../../tests/unit/data/transactionDetailData'
import { isRBFEnabled } from './isRBFEnabled'

describe('isRBFEnabled', () => {
  it('should return false if RBF is not enabled', () => {
    expect(isRBFEnabled(transactionWithoutRBF1)).toBeFalsy()
    expect(isRBFEnabled(transactionWithoutRBF2)).toBeFalsy()
  })
  it('should return true if RBF is not enabled', () => {
    expect(isRBFEnabled(transactionWithRBF1)).toBeTruthy()
    expect(isRBFEnabled(transactionWithRBF2)).toBeTruthy()
  })
})
