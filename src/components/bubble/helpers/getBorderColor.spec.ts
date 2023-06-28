import { getBorderColor } from './getBorderColor'
import tw from '../../../styles/tailwind'

describe('getBorderColor', () => {
  it('should return the correct border color for primary bubble', () => {
    expect(getBorderColor({ color: 'primary', ghost: false })).toEqual(undefined)
    expect(getBorderColor({ color: 'primary', ghost: true })).toEqual(tw`border-primary-main`)
  })
  it('should return the correct border color for primary-mild bubble', () => {
    expect(getBorderColor({ color: 'primary-mild', ghost: false })).toEqual(tw`border-primary-mild-1`)
    expect(getBorderColor({ color: 'primary-mild', ghost: true })).toEqual(tw`border-black-1`)
  })
  it('should return the correct border color for gray bubble', () => {
    expect(getBorderColor({ color: 'gray', ghost: false })).toEqual(tw`border-black-3`)
    expect(getBorderColor({ color: 'gray', ghost: true })).toEqual(tw`border-black-3`)
  })
  it('should return the correct border color for black bubble', () => {
    expect(getBorderColor({ color: 'black', ghost: false })).toEqual(tw`border-black-1`)
    expect(getBorderColor({ color: 'black', ghost: true })).toEqual(tw`border-black-1`)
  })
})
