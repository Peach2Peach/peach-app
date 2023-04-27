import { enforcePremiumFormat } from './enforcePremiumFormat'

describe('enforcePremiumFormat', () => {
  it('should remove all decimals after the second one', () => {
    expect(enforcePremiumFormat('1.234')).toEqual('1.23')
  })
  it('should not add decimals if there are none', () => {
    expect(enforcePremiumFormat('1')).toEqual('1')
  })
  it('should handle numbers', () => {
    expect(enforcePremiumFormat(1.234)).toEqual('1.23')
  })
})
