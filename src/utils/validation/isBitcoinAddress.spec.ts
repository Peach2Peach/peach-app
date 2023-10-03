import { networks } from 'bitcoinjs-lib'
import { isBitcoinAddress } from './isBitcoinAddress'

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
describe('isBitcoinAddress', () => {
  it('should return true if address is valid', () => {
    addresses.bitcoin.forEach((address) => expect(isBitcoinAddress(address, networks.bitcoin)).toBeTruthy())
    addresses.testnet.forEach((address) => expect(isBitcoinAddress(address, networks.testnet)).toBeTruthy())
    addresses.regtest.forEach((address) => expect(isBitcoinAddress(address, networks.regtest)).toBeTruthy())
  })
  it('should return false if address is for different network', () => {
    addresses.regtest.forEach((address) => expect(isBitcoinAddress(address, networks.bitcoin)).toBeFalsy())
    addresses.testnet.forEach((address) => expect(isBitcoinAddress(address, networks.bitcoin)).toBeFalsy())

    addresses.bitcoin.forEach((address) => expect(isBitcoinAddress(address, networks.testnet)).toBeFalsy())
    addresses.regtest.forEach((address) => expect(isBitcoinAddress(address, networks.testnet)).toBeFalsy())

    addresses.bitcoin.forEach((address) => expect(isBitcoinAddress(address, networks.regtest)).toBeFalsy())
    addresses.testnet.forEach((address) => expect(isBitcoinAddress(address, networks.regtest)).toBeFalsy())
  })
  it('should return false if address is invalid', () => {
    invalidAddresses.bitcoin.forEach((address) => expect(isBitcoinAddress(address, networks.bitcoin)).toBeFalsy())
    invalidAddresses.testnet.forEach((address) => expect(isBitcoinAddress(address, networks.testnet)).toBeFalsy())
    invalidAddresses.regtest.forEach((address) => expect(isBitcoinAddress(address, networks.regtest)).toBeFalsy())
  })
})
