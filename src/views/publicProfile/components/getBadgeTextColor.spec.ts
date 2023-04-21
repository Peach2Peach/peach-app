import { getBadgeTextColor } from './getBadgeTextColor'
import tw from '../../../styles/tailwind'

describe('getBadgeTextColor', () => {
  it('should return the correct color for a badge', () => {
    expect(getBadgeTextColor(['badge1'], 'badge1')).toEqual(tw`text-primary-main`)
    expect(getBadgeTextColor(['badge1'], 'badge2')).toEqual(tw`text-primary-mild-1`)
  })

  it('should return the correct color for a dispute badge', () => {
    expect(getBadgeTextColor(['badge1'], 'badge1', true)).toEqual(tw`text-error-mild`)
    expect(getBadgeTextColor(['badge1'], 'badge2', true)).toEqual(tw`text-error-light`)
  })
})
