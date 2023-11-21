import { isRevtag } from './isRevtag'

describe('isRevtag', () => {
  it('should return true for a valid revtag', () => {
    expect(isRevtag('@myrevtag123')).toBe(true)
  })

  it('should return false for an invalid revtag', () => {
    expect(isRevtag('@my invalid revtag')).toBe(false)
  })

  it('should return false for an empty revtag', () => {
    expect(isRevtag('')).toBe(false)
  })

  it('should return false for an "@" symbol', () => {
    expect(isRevtag('@')).toBe(false)
  })
})
