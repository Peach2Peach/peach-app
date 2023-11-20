import { enforceBankNumberFormat } from './enforceBankNumberFormat'

describe('enforceUKBankNumberFormat', () => {
  it('should return empty string when input is empty string', () => {
    const result = enforceBankNumberFormat('')
    expect(result).toBe('')
  })

  it('should remove spaces', () => {
    const result = enforceBankNumberFormat('12 34 56 78')
    expect(result).toBe('12345678')
  })

  it('should remove non numerical characters', () => {
    const result = enforceBankNumberFormat('ab cd ef|@#¢∞¬÷“')
    expect(result).toBe('')
  })
})
