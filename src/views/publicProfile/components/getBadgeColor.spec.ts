import { getBadgeColor } from './getBadgeColor'
import tw from '../../../styles/tailwind'

describe('getBadgeColor', () => {
  it('should return the correct color for a badge', () => {
    expect(getBadgeColor(true)).toEqual(tw`bg-primary-main`)
    expect(getBadgeColor(false)).toEqual(tw`bg-primary-mild-1`)
  })

  it('should return the correct color for a dispute badge', () => {
    expect(getBadgeColor(true, true)).toEqual(tw`bg-error-mild`)
    expect(getBadgeColor(false, true)).toEqual(tw`bg-error-light`)
  })
})
