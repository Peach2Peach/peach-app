import { setLocaleQuiet } from '../../../utils/i18n'
import { shouldNormalCase } from './shouldNormalCase'

describe('shouldNormalCase', () => {
  it('should return true for greek locale and when text transform is uppercase', () => {
    setLocaleQuiet('el-GR')
    expect(shouldNormalCase({ textTransform: 'uppercase' })).toBeTruthy()
  })
  it('should return false for other locale and when text transform is uppercase', () => {
    setLocaleQuiet('de')
    expect(shouldNormalCase({ textTransform: 'uppercase' })).toBeFalsy()
  })
  it('should return false for greek locale and when text transform is not uppercase', () => {
    setLocaleQuiet('el-GR')
    expect(shouldNormalCase({ textTransform: 'lowercase' })).toBeFalsy()
  })
})
