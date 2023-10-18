import { Modal } from 'react-native'
import { fireEvent, render } from 'test-utils'
import { ScanQR } from './ScanQR'

jest.useFakeTimers()
jest.mock('react-native-camera', () => ({
  RNCamera: 'RNCamera',
}))

describe('ScanQR', () => {
  it('renders correctly', () => {
    const { toJSON } = render(<ScanQR onRead={jest.fn()} onCancel={jest.fn()} />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('calls onCancel when the popup is closed or the back navigation is pressed', () => {
    const onCancel = jest.fn()
    const { getByText, UNSAFE_getByType } = render(<ScanQR onRead={jest.fn()} onCancel={onCancel} />)
    const text = getByText('scan QR code')
    fireEvent.press(text)
    expect(onCancel).toHaveBeenCalledTimes(1)
    fireEvent(UNSAFE_getByType(Modal), 'onRequestClose')
    expect(onCancel).toHaveBeenCalledTimes(2)
  })
})
