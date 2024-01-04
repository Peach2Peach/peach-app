import { strictEqual } from 'assert'
import { createTestWallet } from '../../../tests/unit/helpers/createTestWallet'
import { getPublicKeyForEscrow } from './getPublicKeyForEscrow'

describe('getPublicKeyForEscrow', () => {
  it('returns wallet for escrow depending on offer id', () => {
    const expectedPublicKey = '025f088c65f92954f00b9e54cd73f4bc32a9cdbdd8cb99649a6dad39fdcd87c175'
    const recoveredWallet = createTestWallet()

    strictEqual(getPublicKeyForEscrow(recoveredWallet, '1'), expectedPublicKey)
  })
})
