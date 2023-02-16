/* eslint-disable max-lines-per-function */
/* eslint-disable max-len */
import { deepStrictEqual } from 'assert'
import { parseBitcoinRequest } from '../../../../src/utils/bitcoin'

describe('parseBitcoinRequest', () => {
  it('parses valid bitcoin requests', () => {
    const request
      = 'bitcoin:bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq?amount=0.00001&message=Test&time=1649846322&exp=604800'
    const parsedRequest = {
      address: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
      amount: 0.00001,
      message: 'Test',
      time: 1649846322,
      exp: 604800,
    }
    deepStrictEqual(parseBitcoinRequest(request), parsedRequest)
  })

  it('parses valid bitcoin requests with partial data', () => {
    const request = 'bitcoin:bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq?amount=0.00001'
    const parsedRequest = {
      address: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
      amount: 0.00001,
    }
    deepStrictEqual(parseBitcoinRequest(request), parsedRequest)
  })

  it('parses valid bitcoin requests with address only', () => {
    const request = 'bitcoin:bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq'
    const parsedRequest = {
      address: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
    }
    deepStrictEqual(parseBitcoinRequest(request), parsedRequest)
  })

  it('parses valid bitcoin requests with testnet address only', () => {
    const request = 'bitcoin:2MsftWdaS4y847oVwfcD7m5MbRaYaLcfYSQ'
    const parsedRequest = {
      address: '2MsftWdaS4y847oVwfcD7m5MbRaYaLcfYSQ',
    }
    deepStrictEqual(parseBitcoinRequest(request), parsedRequest)
  })

  it('parses valid bitcoin address as fallback', () => {
    const addressesMainnet = [
      'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
      '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
      '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy',
    ]
    const addressesTestnet = 'tb1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq'
    const addressesRegtest = 'bcrt1qk26vxcwteqyn58fwcpp4dqc0ep0jy3argd8zx9yv6f9cm4ak35gsgk6uxz'

    for (const address of addressesMainnet) {
      deepStrictEqual(parseBitcoinRequest(address), { address })
    }

    deepStrictEqual(parseBitcoinRequest(addressesTestnet), { address: addressesTestnet })
    deepStrictEqual(parseBitcoinRequest(addressesRegtest), { address: addressesRegtest })
  })

  it('should return null for lightning invoices', () => {
    const request
      = 'lnbc1u1p39dtcgpp5x4txr8dhemr6htx2ju2y7dc4v4a769qe696mp75tfgvkjwnjue5qdqlvdaxjmn08gszqar0ypqxcmn50p3x7aqsp5qt9z3r047w8em0m8c5d23mwdzdvpxemhd5l5t3cl3a86t0w02q2qxqy9gcqcqzys9qrsgqrzjqd98kxkpyw0l9tyy8r8q57k7zpy9zjmh6sez752wj6gcumqnj3yxzhdsmg6qq56utgqqqqqqqqqqqeqqjqrzjq0h9s36s2kpql0a99c6k4zfq7chcx9sjnsund8damcl96qvc4833tx69gvk26e6efsqqqqlgqqqqpjqqjqrzjqtx3k77yrrav9hye7zar2rtqlfkytl094dsp0ms5majzth6gt7ca6uhdkxl983uywgqqqqqqqqqq86qqjq9hws6jr2vvgq53k2lqm7prn2jf58wutqyhqdgerqvf4h7dtda2cknujs522v5gr2nv6r8xq3f6x7xjwtacadwe5lf3s0lkz24el5w4qq9ztru0'
    const parsedRequest = {}
    deepStrictEqual(parseBitcoinRequest(request), parsedRequest)
  })

  it('should return null for invalid requests', () => {
    const request = 'https://peachbitcoin.com'
    const parsedRequest = {}
    deepStrictEqual(parseBitcoinRequest(request), parsedRequest)
  })

  it('should return null for empty param', () => {
    deepStrictEqual(parseBitcoinRequest(''), {})
  })

  it('parses valid bitcoin requests for testnet', () => {
    const request = 'bitcoin:tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx'
    const parsedRequest = {
      address: 'tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx',
    }
    deepStrictEqual(parseBitcoinRequest(request), parsedRequest)
  })
})
