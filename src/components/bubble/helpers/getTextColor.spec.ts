import { getTextColor } from './getTextColor'
import tw from '../../../styles/tailwind'

describe('getTextColor', () => {
  it('should return the correct text color for primary bubble', () => {
    expect(getTextColor({ color: 'primary', ghost: false })).toEqual(tw`text-primary-background-light`)
    expect(getTextColor({ color: 'primary', ghost: true })).toEqual(tw`text-primary-main`)
  })
  it('should return the correct text color for primary-mild bubble', () => {
    expect(getTextColor({ color: 'primary-mild', ghost: false })).toEqual(tw`text-black-1`)
    expect(getTextColor({ color: 'primary-mild', ghost: true })).toEqual(tw`text-black-1`)
  })
  it('should return the correct text color for gray bubble', () => {
    expect(getTextColor({ color: 'gray', ghost: false })).toEqual(tw`text-black-3`)
    expect(getTextColor({ color: 'gray', ghost: true })).toEqual(tw`text-black-3`)
  })
  it('should return the correct text color for black bubble', () => {
    expect(getTextColor({ color: 'black', ghost: false })).toEqual(tw`text-black-1`)
    expect(getTextColor({ color: 'black', ghost: true })).toEqual(tw`text-black-1`)
  })
})
