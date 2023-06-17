import { isContractId } from './isContractId'

describe('isContractId', () => {
  it('should return true if the id starts with PC-', () => {
    expect(isContractId('PC-123-456')).toBeTruthy()
  })

  it('should return false if the id does not start with PC-', () => {
    expect(isContractId('P-123')).toBeFalsy()
  })
})
