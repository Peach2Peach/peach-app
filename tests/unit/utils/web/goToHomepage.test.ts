import { Linking } from 'react-native'
import { goToHomepage } from '../../../../src/utils/web'

describe('goToHomepage', () => {
  it('should call Linking.openURL with the correct URL', async () => {
    const spy = jest.spyOn(Linking, 'openURL')

    await goToHomepage()

    expect(spy).toHaveBeenCalledWith('https://peachbitcoin.com')
    spy.mockRestore()
  })
})
