import { networks } from 'bitcoinjs-lib'
import i18n from '../../../../src/utils/i18n'
import { getErrorsInField, rules } from '../../../../src/utils/validation'
import { getNetwork } from '../../../../src/utils/wallet'
import paymentData from '../../data/paymentData.json'

jest.mock('../../../../src/utils/wallet', () => ({
  getNetwork: jest.fn(),
}))

describe('getErrorsInField', () => {
  it('should check all given rules', () => {
    const btcRule = jest.spyOn(rules, 'bitcoinAddress')
    const required = jest.spyOn(rules, 'required')
    getErrorsInField('notABitcoinAddress', { bitcoinAddress: true, required: true })
    expect(btcRule).toHaveBeenCalled()
    expect(required).toHaveBeenCalled()
  })
  it('should return errors for invalid values', () => {
    const isValid
      = getErrorsInField(paymentData.bitcoinTestnet.base58Check.invalid[0], {
        bitcoinAddress: true,
        required: true,
      }).length === 0
    expect(isValid).toBeFalsy()
  })
  it('should not return errors for valid values', () => {
    ;(<jest.Mock>getNetwork).mockReturnValue(networks.testnet)
    const isValid
      = getErrorsInField(paymentData.bitcoinTestnet.base58Check.valid[0] as string, {
        bitcoinAddress: true,
        required: true,
      }).length === 0
    expect(isValid).toBeTruthy()
  })
  it('should return all errors that apply', () => {
    const multipleErrors = getErrorsInField('notABitcoinAddress', { bitcoinAddress: true, phone: true, required: true })
    expect(multipleErrors.length).toBe(2)
    expect(multipleErrors.includes(i18n('form.invalid.error'))).toBeTruthy()
    expect(multipleErrors.includes(i18n('form.address.btc.error'))).toBeTruthy()
  })
  it('should not validate disabled rules', () => {
    const isValid = getErrorsInField('notABitcoinAddress', { bitcoinAddress: false, required: true }).length === 0
    expect(isValid).toBeTruthy()
  })
  it('should not validate empty, non-required values', () => {
    const isValid = getErrorsInField('', { bitcoinAddress: true, required: false }).length === 0
    expect(isValid).toBeTruthy()
  })
})
