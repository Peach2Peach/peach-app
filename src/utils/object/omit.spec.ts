import { omit } from './omit'

describe('omit', () => {
  it('should omit a key from object', () => {
    expect(omit({ b: 1, c: 2 }, 'b')).toEqual({ c: 2 })
  })
})
