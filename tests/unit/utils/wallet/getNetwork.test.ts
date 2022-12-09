import { deepStrictEqual } from 'assert'
import { networks } from 'bitcoinjs-lib'
import { getNetwork } from '../../../../src/utils/wallet'

describe('getNetwork', () => {
  it('returns network provided in .env', () => {
    deepStrictEqual(getNetwork(), networks.regtest)
  })
})
