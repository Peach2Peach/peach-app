/* eslint-disable max-lines-per-function */
import { ok } from 'assert'
import { getMessages, rules } from '../../src/utils/validationUtils'
import paymentData from '../data/paymentData.json'

describe('rules', () => {
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

  it('validates btc addresses correctly', () => {
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
  it('has all messages defined', () => {
    const messages = getMessages().default
    for (const message in messages) {
      ok(message)
    }
  })
})
