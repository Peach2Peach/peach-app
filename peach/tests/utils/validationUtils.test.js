import { ok } from 'assert'
import { getMessages, rules } from '../../src/utils/validationUtils'

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

  it('validates email correctly', () => {
    ok(rules.email.test('satoshi@peachtopeach.com'))
    ok(rules.email.test('hal.finney@peachtopeach.com'))
    ok(rules.email.test('hal.finney+category@peachtopeach.com'))

    ok(!rules.email.test('rogerver'))
    ok(!rules.email.test('rogerver@bitcoin'))
    ok(!rules.email.test('rogerver@bitcoin.'))
    ok(!rules.email.test(''))
    ok(!rules.email.test(null))
  })

  it('validates btc addresses correctly', () => {
    // base58Check
    ok(rules.bitcoinAddress(true, '12dRugNcdxK39288NjcDV4GX7rMsKCGn6B'))
    ok(!rules.bitcoinAddress(true, '12dRugNcdxK39288NjcDV4GX7rMsKCGn6C'))

    // bech32
    ok(rules.bitcoinAddress(true, 'bc1qcj5yzmk8mjynz5vyxmre5zsgtntkwkcgn57r7z'))
    ok(!rules.bitcoinAddress(true, 'bc1qcj5yzmk8mjynz5vyxmre5zsgtntkwkcgn57r7e'))

    // general invalid input
    ok(!rules.bitcoinAddress(true, 'invalid'))
  })
  it('validates btc IBAN correctly', () => {
    ok(rules.iban(true, 'BE68539007547034'))

    ok(!rules.iban(true, 'invalid'))
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


