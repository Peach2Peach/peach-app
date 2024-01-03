import Clipboard from '@react-native-clipboard/clipboard'
import { fireEvent, render } from 'test-utils'
import { PeachID } from './PeachID'

describe('PeachID', () => {
  it('should copy only the shortened ID', () => {
    const copy = jest.spyOn(Clipboard, 'setString')
    const { getByText } = render(<PeachID id="123456789" copyable />)

    fireEvent.press(getByText('PEACH12345678'))

    expect(copy).toHaveBeenCalledWith('PEACH12345678')
  })
})
