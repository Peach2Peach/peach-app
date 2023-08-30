/* eslint-disable max-lines-per-function */
import { ok } from 'assert'
import { networks } from 'bitcoinjs-lib'
import { rules } from '.'
import paymentData from '../../../tests/unit/data/paymentData.json'
import { getNetwork } from '../wallet/getNetwork'

jest.mock('../wallet/getNetwork', () => ({
  getNetwork: jest.fn(),
}))

describe('rules', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('validates required fields correctly', () => {
    ok(rules.required(true, 'hello'))
    ok(rules.required(true, 21000))

    ok(!rules.required(true, ''))
    ok(!rules.required(true, null))
  })

  it('validates btc addresses correctly for mainnet', () => {
    (<jest.Mock>getNetwork).mockReturnValue(networks.bitcoin)
    for (const address of paymentData.bitcoin.base58Check.valid) {
      ok(rules.bitcoinAddress(true, address), `Could not validate ${address}`)
    }
    for (const address of paymentData.bitcoin.base58Check.invalid) {
      ok(!rules.bitcoinAddress(true, address), `Could not invalidate ${address}`)
    }
    for (const address of paymentData.bitcoin.bech32.valid) {
      ok(rules.bitcoinAddress(true, address), `Could not validate ${address}`)
    }
    for (const address of paymentData.bitcoin.bech32.invalid) {
      ok(!rules.bitcoinAddress(true, address), `Could not invalidate ${address}`)
    }

    // general invalid input
    ok(!rules.bitcoinAddress(true, 'invalid'))
  })

  it('validates btc addresses correctly for testnet', () => {
    (<jest.Mock>getNetwork).mockReturnValue(networks.testnet)
    for (const address of paymentData.bitcoinTestnet.base58Check.valid) {
      ok(rules.bitcoinAddress(true, address), `Could not validate ${address}`)
    }
    for (const address of paymentData.bitcoinTestnet.base58Check.invalid) {
      ok(!rules.bitcoinAddress(true, address), `Could not invalidate ${address}`)
    }
    for (const address of paymentData.bitcoinTestnet.bech32.valid) {
      ok(rules.bitcoinAddress(true, address), `Could not validate ${address}`)
    }
    for (const address of paymentData.bitcoinTestnet.bech32.invalid) {
      ok(!rules.bitcoinAddress(true, address), `Could not invalidate ${address}`)
    }

    // general invalid input
    ok(!rules.bitcoinAddress(true, 'invalid'))
  })

  it('validates password correctly', () => {
    ok(rules.password(true, 'strongPassword1!'), 'Could not validate strongPassword1!')
    ok(rules.password(true, '12345678'), 'Could not validate weak')
    ok(!rules.password(true, '1234567'), 'Could not validate weak')
    ok(!rules.password(true, 'weak'), 'Could not validate weak')
    ok(!rules.password(true, ''), 'Could not validate weak')
  })
})
