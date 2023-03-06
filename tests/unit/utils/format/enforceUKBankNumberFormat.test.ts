import { enforceUKBankNumberFormat } from '../../../../src/utils/format/enforceUKBankNumberFormat'

describe('enforceUKBankNumberFormat', () => {
  it('should return empty string when input is empty string', () => {
    const result = enforceUKBankNumberFormat('')
    expect(result).toBe('')
  })

  it('should remove spaces', () => {
    const result = enforceUKBankNumberFormat('12 34 56 78')
    expect(result).toBe('12345678')
  })

  it('should remove non numerical characters', () => {
    const result = enforceUKBankNumberFormat('ab cd ef|@#¢∞¬÷“')
    expect(result).toBe('')
  })
})
