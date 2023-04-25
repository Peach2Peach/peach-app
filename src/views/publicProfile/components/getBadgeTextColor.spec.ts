import { getBadgeTextColor } from './getBadgeTextColor'
import tw from '../../../styles/tailwind'

describe('getBadgeTextColor', () => {
  it('should return the correct color for a badge', () => {
    expect(getBadgeTextColor(true)).toEqual(tw`text-primary-main`)
    expect(getBadgeTextColor(false)).toEqual(tw`text-primary-mild-1`)
  })

  it('should return the correct color for a dispute badge', () => {
    expect(getBadgeTextColor(true, true)).toEqual(tw`text-error-mild`)
    expect(getBadgeTextColor(false, true)).toEqual(tw`text-error-light`)
  })
})
