import { ok } from 'assert'
import { networks } from 'bitcoinjs-lib'
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

const getNetworkMock = jest.fn().mockReturnValue(networks.regtest)
jest.mock('../wallet', () => ({
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
