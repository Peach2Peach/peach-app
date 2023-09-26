import { isBitcoinAddress } from './isBitcoinAddress'

describe('isBitcoinAddress', () => {
  it('should return true if address is valid', () => {
    expect(isBitcoinAddress('bcrt1qm50khyunelhjzhckvgy3qj0hn7xjzzwljhfgd0')).toBe(true)
    expect(isBitcoinAddress('bc1pdqrcrxa8vx6gy75mfdfj84puhxffh4fq46h3gkp6jxdd0vjcsdyspfxcv6')).toBe(true)
    expect(isBitcoinAddress('bcrt1pvsl0uj3m2wew9fngpzqyga2jdsfngjkwcj5rg8qwpf9y6graadeqr7k9yu')).toBe(true)
    expect(isBitcoinAddress('12dRugNcdxK39288NjcDV4GX7rMsKCGn6B')).toBe(true)
  })

  it('should return false if address is invalid', () => {
    expect(isBitcoinAddress('bcrt1qm50khyunelhjzhckvgy3qj0hn7xjzzwljhfgd')).toBe(false)
    expect(isBitcoinAddress('bc1pdqrcrxa8vx6gy75mfdfj84puhxffh4fq46h3kp6jxdd0vjcsdyspfxcv6')).toBe(false)
    expect(isBitcoinAddress('bcrt1pvsl0uj3m2wew9fngpzqyga2jdsfngkwcj5rg8qwpf9y6graadeqr7k9yu')).toBe(false)
    expect(isBitcoinAddress('12dRugNcdxK39288NjcDV4G7rMsKCGn6B')).toBe(false)
    expect(isBitcoinAddress('address')).toBe(false)
  })
})
