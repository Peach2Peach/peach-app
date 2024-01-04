import tw from '../../../styles/tailwind'
import { getIconColor } from './getIconColor'

describe('getIconColor', () => {
  it('should return the correct icon color for primary bubble', () => {
    expect(getIconColor({ color: 'primary', ghost: false })).toEqual(tw`text-primary-background-light`)
    expect(getIconColor({ color: 'primary', ghost: true })).toEqual(tw`text-primary-main`)
  })
  it('should return the correct icon color for primary-mild bubble', () => {
    expect(getIconColor({ color: 'primary-mild', ghost: false })).toEqual(tw`text-primary-main`)
    expect(getIconColor({ color: 'primary-mild', ghost: true })).toEqual(tw`text-black-100`)
  })
  it('should return the correct icon color for gray bubble', () => {
    expect(getIconColor({ color: 'gray', ghost: false })).toEqual(tw`text-black-50`)
    expect(getIconColor({ color: 'gray', ghost: true })).toEqual(tw`text-black-50`)
  })
  it('should return the correct icon color for black bubble', () => {
    expect(getIconColor({ color: 'black', ghost: false })).toEqual(tw`text-black-100`)
    expect(getIconColor({ color: 'black', ghost: true })).toEqual(tw`text-black-100`)
  })
})
