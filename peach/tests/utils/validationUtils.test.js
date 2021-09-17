import { ok } from 'assert'
import { getMessages, rules } from '../../src/utils/validationUtils'
import paymentData from '../data/paymentData.json'

// eslint-disable-next-line max-lines-per-function
describe('rules', () => {
  it('validates required fields correctly', () => {
    ok(rules.required(true, 'hello'))
    ok(rules.required(true, 21000))

    ok(!rules.required(true, ''))
    ok(!rules.required(true, null))
  })

  it('validates numbers correctly', () => {
    ok(rules.number.test(0))
    ok(rules.number.test(1))
    ok(rules.number.test(21000))
    ok(rules.number.test('0'))
    ok(rules.number.test('1'))
    ok(rules.number.test('210000'))

    ok(!rules.number.test('hello'))
    ok(!rules.number.test(''))
    ok(!rules.number.test(null))
  })

  it('validates phone correctly', () => {
    paymentData.phone.valid.forEach(phone => ok(rules.phone.test(phone), `Could not validate ${phone}`))
    paymentData.phone.invalid.forEach(phone => ok(!rules.phone.test(phone), `Could not invalidate ${phone}`))
  })

  it('validates email correctly', () => {
    paymentData.email.valid.forEach(email => ok(rules.email.test(email), `Could not validate ${email}`))
    paymentData.email.invalid.forEach(email => ok(!rules.email.test(email), `Could not invalidate ${email}`))
  })

  it('validates btc addresses correctly', () => {
    paymentData.bitcoin.base58Check.valid.forEach(address => ok(
      rules.bitcoinAddress(true, address),
      `Could not validate ${address}`
    ))
    paymentData.bitcoin.base58Check.invalid.forEach(address => ok(
      !rules.bitcoinAddress(true, address),
      `Could not invalidate ${address}`
    ))
    paymentData.bitcoin.bech32.valid.forEach(address => ok(
      rules.bitcoinAddress(true, address),
      `Could not validate ${address}`
    ))
    paymentData.bitcoin.bech32.invalid.forEach(address => ok(
      !rules.bitcoinAddress(true, address),
      `Could not invalidate ${address}`
    ))

    // general invalid input
    ok(!rules.bitcoinAddress(true, 'invalid'))
  })
  it('validates btc IBAN correctly', () => {
    paymentData.iban.valid.forEach(iban => ok(rules.iban(true, iban), `Could not validate ${iban}`))
    paymentData.iban.invalid.forEach(iban => ok(!rules.iban(true, iban), `Could not invalidate ${iban}`))
  })
})

describe('getMessages', () => {
  it('has all messages defined', () => {
    const messages = getMessages().default
    Object.keys(messages)
      .map(key => messages[key])
      .map(message => ok(message))
  })
})


