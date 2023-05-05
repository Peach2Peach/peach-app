import { deepStrictEqual } from 'assert'
import { getWallet, setWallet } from '.'
import { createTestWallet } from '../../../tests/unit/helpers/createTestWallet'

describe('setWallet', () => {
  it('returns wallet for escrow depending on offer id', () => {
    const recoveredWallet = createTestWallet()
    setWallet(recoveredWallet.wallet)

    deepStrictEqual(getWallet(), recoveredWallet.wallet)
  })
})
