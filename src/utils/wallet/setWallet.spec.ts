import { deepStrictEqual } from 'assert'
import { createTestWallet } from '../../../tests/unit/helpers/createTestWallet'
import { getWallet } from './getWallet'
import { setWallet } from './setWallet'

describe('setWallet', () => {
  it('returns wallet for escrow depending on offer id', () => {
    const recoveredWallet = createTestWallet()
    setWallet(recoveredWallet)

    deepStrictEqual(getWallet(), recoveredWallet)
  })
})
