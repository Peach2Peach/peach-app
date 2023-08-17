import { isBitcoinAddress } from './isBitcoinAddress'

describe('isBitcoinAddress', () => {
  it('should return true if address is valid', () => {
    expect(isBitcoinAddress('bcrt1qm50khyunelhjzhckvgy3qj0hn7xjzzwljhfgd0')).toBe(true)
  })

  it('should return false if address is invalid', () => {
    expect(isBitcoinAddress('address')).toBe(false)
  })
})
