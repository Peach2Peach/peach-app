import { ok } from 'assert'
import { networks } from 'bitcoinjs-lib'
import { liquidAddresses } from '../../../tests/unit/data/liquidNetworkData'
import { rules } from './rules'

describe('rules', () => {
  it('validates required fields correctly', () => {
    ok(rules.required('hello'))
    ok(!rules.required(''))
  })
})

const addresses = {
  bitcoin: ['bc1pdqrcrxa8vx6gy75mfdfj84puhxffh4fq46h3gkp6jxdd0vjcsdyspfxcv6', '12dRugNcdxK39288NjcDV4GX7rMsKCGn6B'],
  testnet: [
    'tb1pwq9p5dj5577xr36e5xwc5gh93qw0qultf5vvqdkdr7q5umunesaque098t',
    'tb1qmqvdm66kfx8fnc7cqytsj6yp92ms6kames8lz4',
  ],
  regtest: [
    'bcrt1qm50khyunelhjzhckvgy3qj0hn7xjzzwljhfgd0',
    'bcrt1pvsl0uj3m2wew9fngpzqyga2jdsfngjkwcj5rg8qwpf9y6graadeqr7k9yu',
  ],
}
const invalidAddresses = {
  bitcoin: ['bc1pdqrcrxa8vx6gy75mfdfj84puhxffh4fq46h3kp6jxdd0vjcsdyspfxcv6', '12dRugNcdxK39288NjcDV4G7rMsKCGn6B'],
  testnet: [
    'tb1pwq9p5dj5577xr36e5xwc5gh9qw0qultf5vvqdkdr7q5umunesaque098t',
    'tb1qmqvdm66kfx8fnc7cqyts6yp92ms6kames8lz4',
  ],
  regtest: [
    'bcrt1qm50khyunelhjzhckvgy3qj0hn7xjzzwljhfgd',
    'bcrt1pvsl0uj3m2wew9fngpzqyga2jdsfngkwcj5rg8qwpf9y6graadeqr7k9yu',
  ],
}


const invalidLiquidAddresses = {
  liquid: [
    'ex1qmh0un07z5gmv69yg687wglhgj2mscysh2sw6k3',
    'QHVYYerCaH8zAXgKnw5H3YXQ3RgcCXmh9f',
    'ex1qc0a5g32xyjm85el94l3pfsjngu887786t9m6pv5stdrzmpm6nr0stjup6x',
    'H36FU3csPfSEZj3RyEDkmsgBWSwgDcLBAR',
  ],
  testnet: [
    'tex1qfcjnukn8u7mwz0n7cxy5fjv5zpj57m8muv8094',
    'FcHumbpUerNFJHsDdDejoqvk8kDjxqx4TB',
    'tex1qf6gjuuu3ys47juscesy76dw6w9at4stla50tthasnfu3vzny2hqqfyq0gm',
    '8ms2towULZV7XoUxwFs7uwwESgQnjHB4Yx',
  ],
  regtest: [
    'ert1q9vza2e8x573nczrlzms0wvx3gsqjx7vaunpxa0',
    '2ddMES6Ez33LnmwN7QP2GF4buShoPtX3yP9',
    'ert1qj99wcphdxszal0xff98mzvtfap2xl6ylx8nxxr8s53gxmv5yq4dsd5k7gt',
    'XHWCjibZsdGvHBxFXjEoq7GyyJMCKRo4wo',
  ],
}

const getNetworkMock = jest.fn().mockReturnValue(networks.regtest)
jest.mock('../wallet/getNetwork', () => ({
  getNetwork: () => getNetworkMock(),
}))

describe('bitcoinAddress', () => {
  it('should return true if address is valid', () => {
    getNetworkMock.mockReturnValue(networks.bitcoin)
    addresses.bitcoin.forEach((address) => expect(rules.bitcoinAddress(address)).toBeTruthy())
    getNetworkMock.mockReturnValue(networks.testnet)
    addresses.testnet.forEach((address) => expect(rules.bitcoinAddress(address)).toBeTruthy())
    getNetworkMock.mockReturnValue(networks.regtest)
    addresses.regtest.forEach((address) => expect(rules.bitcoinAddress(address)).toBeTruthy())
  })
  it('should return false if address is for different network', () => {
    getNetworkMock.mockReturnValue(networks.bitcoin)
    addresses.regtest.forEach((address) => expect(rules.bitcoinAddress(address)).toBeFalsy())
    addresses.testnet.forEach((address) => expect(rules.bitcoinAddress(address)).toBeFalsy())

    getNetworkMock.mockReturnValue(networks.testnet)
    addresses.bitcoin.forEach((address) => expect(rules.bitcoinAddress(address)).toBeFalsy())
    addresses.regtest.forEach((address) => expect(rules.bitcoinAddress(address)).toBeFalsy())

    getNetworkMock.mockReturnValue(networks.regtest)
    addresses.bitcoin.forEach((address) => expect(rules.bitcoinAddress(address)).toBeFalsy())
    addresses.testnet.forEach((address) => expect(rules.bitcoinAddress(address)).toBeFalsy())
  })
  it('should return false if address is invalid', () => {
    getNetworkMock.mockReturnValue(networks.bitcoin)
    invalidAddresses.bitcoin.forEach((address) => expect(rules.bitcoinAddress(address)).toBeFalsy())
    getNetworkMock.mockReturnValue(networks.testnet)
    invalidAddresses.testnet.forEach((address) => expect(rules.bitcoinAddress(address)).toBeFalsy())
    getNetworkMock.mockReturnValue(networks.regtest)
    invalidAddresses.regtest.forEach((address) => expect(rules.bitcoinAddress(address)).toBeFalsy())
  })
})

describe('liquidAddress', () => {
  it('should return true if address is valid', () => {
    getNetworkMock.mockReturnValue(networks.bitcoin)
    liquidAddresses.liquid.forEach((address) => expect(rules.liquidAddress(address)).toBeTruthy())
    getNetworkMock.mockReturnValue(networks.testnet)
    liquidAddresses.testnet.forEach((address) => expect(rules.liquidAddress(address)).toBeTruthy())
    getNetworkMock.mockReturnValue(networks.regtest)
    liquidAddresses.regtest.forEach((address) => expect(rules.liquidAddress(address)).toBeTruthy())
  })
  it('should return false if address is for different network', () => {
    getNetworkMock.mockReturnValue(networks.bitcoin)
    liquidAddresses.regtest.forEach((address) => expect(rules.liquidAddress(address)).toBeFalsy())
    liquidAddresses.testnet.forEach((address) => expect(rules.liquidAddress(address)).toBeFalsy())

    getNetworkMock.mockReturnValue(networks.testnet)
    liquidAddresses.liquid.forEach((address) => expect(rules.liquidAddress(address)).toBeFalsy())
    liquidAddresses.regtest.forEach((address) => expect(rules.liquidAddress(address)).toBeFalsy())

    getNetworkMock.mockReturnValue(networks.regtest)
    liquidAddresses.liquid.forEach((address) => expect(rules.liquidAddress(address)).toBeFalsy())
    liquidAddresses.testnet.forEach((address) => expect(rules.liquidAddress(address)).toBeFalsy())
  })
  it('should return false if address is invalid', () => {
    getNetworkMock.mockReturnValue(networks.bitcoin)
    invalidLiquidAddresses.liquid.forEach((address) => expect(rules.bitcoinAddress(address)).toBeFalsy())
    getNetworkMock.mockReturnValue(networks.testnet)
    invalidLiquidAddresses.testnet.forEach((address) => expect(rules.bitcoinAddress(address)).toBeFalsy())
    getNetworkMock.mockReturnValue(networks.regtest)
    invalidLiquidAddresses.regtest.forEach((address) => expect(rules.bitcoinAddress(address)).toBeFalsy())
  })
})

describe('isURL', () => {
  it('should return true for a valid URL', () => {
    expect(rules.url('https://www.example.com')).toBe(true)
    expect(rules.url('https://www.example.com:8333')).toBe(true)
    expect(rules.url('https://www.example.com/?query=param')).toBe(true)
    expect(rules.url('https://www.example.com/#anchor')).toBe(true)
    expect(rules.url('http://example.com')).toBe(true)
    expect(rules.url('ssl://example.com')).toBe(true)
    expect(rules.url('ftp://example.com')).toBe(true)
    expect(rules.url('example.com')).toBe(true)
  })
  it('should return true for a valid IP', () => {
    expect(rules.url('192.168.1.21')).toBe(true)
    expect(rules.url('192.168.1.21:8333')).toBe(true)
  })

  it('should return false for an invalid URL', () => {
    expect(rules.url('https://')).toBe(false)
  })

  it('should return false for an empty string', () => {
    expect(rules.url('')).toBe(false)
  })
})

describe('isReferralCode', () => {
  it('should return true for a valid referral code', () => {
    expect(rules.referralCode('PR0043')).toBe(true)
    expect(rules.referralCode('SATOSHI')).toBe(true)
  })

  it('should return false for an empty referral code', () => {
    expect(rules.referralCode('')).toBe(false)
  })
  it('should return false for an invalid referral code', () => {
    expect(rules.referralCode('ABCDEFGHIJKLMNOPQ')).toBe(false)
    expect(rules.referralCode('@CRAIGWRONG')).toBe(false)
  })
})

describe('isValidFeeRate', () => {
  it('should return true a valid fee rate', () => {
    expect(rules.feeRate('123')).toBe(true)
    expect(rules.feeRate('1')).toBe(true)
    expect(rules.feeRate('1.4')).toBe(true)
  })
  it('should return false a fee rate below 1', () => {
    expect(rules.feeRate('0.8')).toBe(false)
    expect(rules.feeRate('0')).toBe(false)
    expect(rules.feeRate('-1')).toBe(false)
    expect(rules.feeRate('-1.5')).toBe(false)
  })
  it('should return false not a number', () => {
    expect(rules.feeRate('a')).toBe(false)
    expect(rules.feeRate('.')).toBe(false)
  })
})
