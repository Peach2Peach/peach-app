import { deepStrictEqual } from 'assert'
import { networks } from 'bitcoinjs-lib'
import { getNetwork } from '.'

describe('getNetwork', () => {
  it('returns network provided in .env', () => {
    deepStrictEqual(getNetwork(), networks.regtest)
  })
})
