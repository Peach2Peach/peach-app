import { isBitcoinAddress } from './isBitcoinAddress'

const toOutputScriptMock = jest.fn()

jest.mock('bitcoinjs-lib', () => ({
  ...jest.requireActual('bitcoinjs-lib'),
  address: {
    toOutputScript: (...args: any[]) => toOutputScriptMock(...args),
  },
}))

describe('isBitcoinAddress', () => {
  it('should return true if address is valid', () => {
    toOutputScriptMock.mockImplementationOnce(() => true)

    expect(isBitcoinAddress('address')).toBe(true)
  })

  it('should return false if address is invalid', () => {
    toOutputScriptMock.mockImplementationOnce(() => {
      throw new Error()
    })

    expect(isBitcoinAddress('address')).toBe(false)
  })
})
