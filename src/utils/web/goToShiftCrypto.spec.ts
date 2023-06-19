import { Linking } from 'react-native'
import { goToShiftCrypto } from './goToShiftCrypto'

describe('goToShiftCrypto', () => {
  it('should open the correct link', () => {
    const openStub = jest.spyOn(Linking, 'openURL')

    goToShiftCrypto()

    expect(openStub).toHaveBeenCalledWith('https://shiftcrypto.ch/bitbox02/?ref=DLX6l9ccCc')
  })
})
