import { getBadgeColor } from './getBadgeColor'
import tw from '../../../styles/tailwind'

describe('getBadgeColor', () => {
  it('should return the correct color for a badge', () => {
    expect(getBadgeColor(['badge1'], 'badge1')).toEqual(tw`bg-primary-main`)
    expect(getBadgeColor(['badge1'], 'badge2')).toEqual(tw`bg-primary-mild-1`)
  })

  it('should return the correct color for a dispute badge', () => {
    expect(getBadgeColor(['badge1'], 'badge1', true)).toEqual(tw`bg-error-mild`)
    expect(getBadgeColor(['badge1'], 'badge2', true)).toEqual(tw`bg-error-light`)
  })
})
