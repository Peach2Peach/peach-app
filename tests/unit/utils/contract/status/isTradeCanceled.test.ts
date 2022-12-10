import { ok } from 'assert'
import { isTradeCanceled } from '../../../../../src/utils/contract/status'
import { contract } from '../../../data/contractData'

describe('isTradeCanceled', () => {
  it('should check if trade has been canceled', () => {
    ok(
      isTradeCanceled({
        ...contract,
        canceled: true,
      }),
    )
    ok(
      !isTradeCanceled({
        ...contract,
        canceled: false,
      }),
    )
  })
})
