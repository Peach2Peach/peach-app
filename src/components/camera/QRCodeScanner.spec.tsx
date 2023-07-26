import { QRCodeScanner } from './QRCodeScanner'
import { fireEvent, render } from '@testing-library/react-native'
import { View } from 'react-native'
import { toMatchDiffSnapshot } from 'snapshot-diff'
import { RNCamera } from 'react-native-camera'
expect.extend({ toMatchDiffSnapshot })

jest.useFakeTimers()
jest.mock('react-native-camera', () => ({
  RNCamera: 'RNCamera',
}))

describe('QRCodeScanner', () => {
  it('renders correctly', () => {
    const { toJSON } = render(<QRCodeScanner onRead={jest.fn()} customMarker={<View />} />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('fades in', () => {
    const { toJSON } = render(<QRCodeScanner onRead={jest.fn()} customMarker={<View />} />)
    jest.runAllTimers()
    const { toJSON: toJSON2 } = render(<QRCodeScanner onRead={jest.fn()} customMarker={<View />} />)
    expect(toJSON2()).toMatchDiffSnapshot(toJSON())
  })
  it('calls onRead when a QR code is read', () => {
    const onRead = jest.fn()
    const { UNSAFE_getByType } = render(<QRCodeScanner onRead={onRead} customMarker={<View />} />)
    fireEvent(UNSAFE_getByType(RNCamera), 'onBarCodeRead', { data: 'test' })
    expect(onRead).toHaveBeenCalledWith({ data: 'test' })
  })
})
