/* eslint-disable max-lines-per-function */
import { ok } from 'assert'
import { networks } from 'bitcoinjs-lib'
import i18n from '../../../src/utils/i18n'
import { getErrorsInField, getMessages, rules } from '../../../src/utils/validation'
import { getNetwork } from '../../../src/utils/wallet'
import paymentData from '../data/paymentData.json'

jest.mock('../../../src/utils/wallet', () => ({
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

  it('validates numbers correctly', () => {
    ok(rules.number.test('0'))
    ok(rules.number.test('1'))
    ok(rules.number.test('210000'))

    ok(!rules.number.test('hello'))
    ok(!rules.number.test(''))
  })

  it('validates phone correctly', () => {
    for (const phone of paymentData.phone.valid) {
      ok(rules.phone.test(phone), `Could not validate ${phone}`)
    }
    for (const phone of paymentData.phone.invalid) {
      ok(!rules.phone.test(phone), `Could not invalidate ${phone}`)
    }
  })

  it('validates email correctly', () => {
    for (const email of paymentData.email.valid) {
      ok(rules.email.test(email), `Could not validate ${email}`)
    }
    for (const email of paymentData.email.invalid) {
      ok(!rules.email.test(email), `Could not invalidate ${email}`)
    }
  })

  it('validates btc addresses correctly for mainnet', () => {
    ;(<jest.Mock>getNetwork).mockReturnValue(networks.bitcoin)
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
    ;(<jest.Mock>getNetwork).mockReturnValue(networks.testnet)
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

  it('validates btc IBAN correctly', () => {
    for (const iban of paymentData.iban.valid) {
      ok(rules.iban(true, iban), `Could not validate ${iban}`)
    }
    for (const iban of paymentData.iban.invalid) {
      ok(!rules.iban(true, iban), `Could not invalidate ${iban}`)
    }
  })
})

describe('getMessages', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('has all messages defined', () => {
    const messages = getMessages()
    for (const message in messages) {
      ok(message)
    }
  })
  it('returns messages in the right language', () => {
    i18n.setLocale(null, { locale: 'en' })
    expect(getMessages().required).toEqual(i18n('form.required.error'))
    i18n.setLocale(null, { locale: 'de' })
    expect(getMessages().required).toEqual(i18n('form.required.error'))
  })
})

describe('getErrorMessage', () => {
  it('should check all given rules', () => {
    const btcRule = jest.spyOn(rules, 'bitcoinAddress')
    const required = jest.spyOn(rules, 'required')
    getErrorsInField('notABitcoinAddress', { bitcoinAddress: true, required: true })
    expect(btcRule).toHaveBeenCalled()
    expect(required).toHaveBeenCalled()
  })
  it('should return errors for invalid values', () => {
    const isValid
      = getErrorsInField(paymentData.bitcoinTestnet.base58Check.invalid[0] as string, {
        bitcoinAddress: true,
        required: true,
      }).length === 0
    expect(isValid).toBeFalsy()
  })
  it('should not return errors for valid values', () => {
    ;(<jest.Mock>getNetwork).mockReturnValue(networks.testnet)
    const isValid
      = getErrorsInField(paymentData.bitcoinTestnet.base58Check.valid[0] as string, {
        bitcoinAddress: true,
        required: true,
      }).length === 0
    expect(isValid).toBeTruthy()
  })
  it('should return all errors that apply', () => {
    const multipleErrors = getErrorsInField('notABitcoinAddress', { bitcoinAddress: true, phone: true, required: true })
    expect(multipleErrors.length).toBe(2)
    expect(multipleErrors.includes(i18n('form.invalid.error'))).toBeTruthy()
    expect(multipleErrors.includes(i18n('form.address.btc.error'))).toBeTruthy()
  })
  it('should not validate disabled rules', () => {
    const isValid = getErrorsInField('notABitcoinAddress', { bitcoinAddress: false, required: true }).length === 0
    expect(isValid).toBeTruthy()
  })
  it('should not validate empty, non-required values', () => {
    const isValid = getErrorsInField('', { bitcoinAddress: true, required: false }).length === 0
    expect(isValid).toBeTruthy()
  })
})
