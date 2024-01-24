import { toTimeFormat } from './toTimeFormat'

describe('toTimeFormat', () => {
  it('returns hours, minutes and seconds to hh:mm:ss', () => {
    const hours1 = 1
    const minutes1 = 2
    expect(toTimeFormat(hours1, minutes1)).toBe('01:02')
    const hours2 = 23
    const minutes2 = 25
    expect(toTimeFormat(hours2, minutes2)).toBe('23:25')
    const hours3 = 23
    const minutes3 = 25
    const seconds3 = 9
    expect(toTimeFormat(hours3, minutes3, seconds3)).toBe('23:25:09')
  })
})
