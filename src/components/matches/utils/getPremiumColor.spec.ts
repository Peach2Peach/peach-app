import tw from '../../../styles/tailwind'
import { getPremiumColor } from './getPremiumColor'

describe('getPremiumColor', () => {
  const green = tw`text-success-main`
  const grey = tw`text-black-4`
  const red = tw`text-primary-main`
  it('should return correct color for buy offer', () => {
    expect(getPremiumColor(-1, true)).toEqual(green)
    expect(getPremiumColor(0, true)).toEqual(grey)
    expect(getPremiumColor(1, true)).toEqual(red)
  })

  it('should return correct color for sell offer', () => {
    expect(getPremiumColor(1, false)).toEqual(green)
    expect(getPremiumColor(0, false)).toEqual(grey)
    expect(getPremiumColor(-1, false)).toEqual(red)
  })
})
