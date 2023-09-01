import { toTimeFormat } from './toTimeFormat'

describe('toTimeFormat', () => {
  it('returns hours and minutes to hh:mm', () => {
    expect(toTimeFormat(1, 2)).toBe('01:02')
    expect(toTimeFormat(23, 25)).toBe('23:25')
    expect(toTimeFormat(23, 25, 9)).toBe('23:25:09')
  })
})
