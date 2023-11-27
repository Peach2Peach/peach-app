import i18n from '../i18n'
import { getErrorsInField } from './getErrorsInField'
import { rules } from './rules'

describe('getErrorsInField', () => {
  it('should check all given rules', () => {
    const btcRule = jest.spyOn(rules, 'referralCode')
    const required = jest.spyOn(rules, 'required')
    getErrorsInField('notABitcoinAddress', { referralCode: true, required: true })
    expect(btcRule).toHaveBeenCalled()
    expect(required).toHaveBeenCalled()
  })
  it('should return errors for invalid values', () => {
    const isValid
      = getErrorsInField('', {
        required: true,
      }).length === 0
    expect(isValid).toBeFalsy()
  })
  it('should not return errors for valid values', () => {
    const isValid
      = getErrorsInField('someValue', {
        required: true,
      }).length === 0
    expect(isValid).toBeTruthy()
  })
  it('should return all errors that apply', () => {
    const multipleErrors = getErrorsInField('', { bip39Word: true, required: true })
    expect(multipleErrors.length).toBe(2)
    expect(multipleErrors.includes(i18n('form.bip39Word.error'))).toBeTruthy()
    expect(multipleErrors.includes(i18n('form.required.error'))).toBeTruthy()
  })
  it('should not validate disabled rules', () => {
    const isValid = getErrorsInField('notABitcoinAddress', { bip39Word: false, required: true }).length === 0
    expect(isValid).toBeTruthy()
  })
  it('should not validate empty, non-required values', () => {
    const isValid = getErrorsInField('', { bip39Word: true, required: false }).length === 0
    expect(isValid).toBeTruthy()
  })
})
