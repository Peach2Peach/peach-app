import tw from '../../../../../styles/tailwind'
import { getLetterSpacing } from './getLetterSpacing'

describe('getLetterSpacing', () => {
  it('should return the correct values', () => {
    const style = [tw`text-20px`, tw`text-primary-main`, tw`font-bold`]
    const result = getLetterSpacing(style)
    expect(result).toEqual({
      digit: -1.5,
      dot: -4.2,
      whiteSpace: -7,
    })
  })
  it('should fallback to a size of 22', () => {
    const style = [tw`text-primary-main`, tw`font-bold`]
    const result = getLetterSpacing(style)
    expect(result).toEqual({
      digit: -1.65,
      dot: -4.62,
      whiteSpace: -7.699999999999999,
    })
  })
})
