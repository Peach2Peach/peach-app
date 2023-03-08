import { isTaproot } from '../../../../src/utils/validation/isTaproot'

describe('isTaproot', () => {
  it('should return true if address is taproot address', () => {
    expect(isTaproot('tb1p')).toBe(true)
    expect(isTaproot('bcrt1p')).toBe(true)
    expect(isTaproot('bc1p')).toBe(true)
  })
  it('should return false if address is not taproot address', () => {
    expect(isTaproot('tb1q')).toBe(false)
    expect(isTaproot('bcrt1q')).toBe(false)
    expect(isTaproot('bc1q')).toBe(false)
  })
})
