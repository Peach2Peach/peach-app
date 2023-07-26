import { BitcoinAddressInput } from './BitcoinAddressInput'
import { render, fireEvent, act, waitFor } from '@testing-library/react-native'
import { createRenderer } from 'react-test-renderer/shallow'
import i18n from '../../utils/i18n'
import Clipboard from '@react-native-clipboard/clipboard'
import { ScanQR } from '../camera/ScanQR'
import permissions, { RESULTS } from 'react-native-permissions'
import { toMatchDiffSnapshot } from 'snapshot-diff'
import { usePopupStore } from '../../store/usePopupStore'
expect.extend({ toMatchDiffSnapshot })

jest.mock('../camera/ScanQR', () => ({
  ScanQR: 'ScanQR',
}))

describe('BitcoinAddressInput', () => {
  const fullAddress = 'bc1qcj5yzmk8mjynz5vyxmre5zsgtntkwkcgn57r7z'
  it('renders correctly', () => {
    const renderer = createRenderer()
    renderer.render(<BitcoinAddressInput value={fullAddress} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('shows full address when focused', () => {
    const { getByPlaceholderText } = render(<BitcoinAddressInput value={fullAddress} />)
    const input = getByPlaceholderText(i18n('form.address.btc.placeholder'))

    fireEvent(input, 'focus')
    expect(input.props.value).toBe(fullAddress)
  })
  it('sets focused to false when blurred', () => {
    const { getByPlaceholderText, toJSON } = render(<BitcoinAddressInput value={fullAddress} />)
    const input = getByPlaceholderText(i18n('form.address.btc.placeholder'))
    const { toJSON: toJSON2 } = render(<BitcoinAddressInput value={fullAddress} />)

    fireEvent(input, 'focus')
    fireEvent(input, 'blur')
    expect(JSON.stringify(toJSON())).toBe(JSON.stringify(toJSON2()))
  })
  it('pastes address from clipboard', async () => {
    const onChangeMock = jest.fn()
    Clipboard.setString(fullAddress)
    const { UNSAFE_getByProps } = render(<BitcoinAddressInput value={''} onChange={onChangeMock} />)
    const clipboardIcon = UNSAFE_getByProps({ id: 'clipboard' })

    await act(() => {
      fireEvent.press(clipboardIcon)
    })
    expect(onChangeMock).toHaveBeenCalledWith(fullAddress)
  })
  it('pastes clipboard value if it is not a valid bitcoin address', async () => {
    const onChangeMock = jest.fn()
    Clipboard.setString('https://peachbitcoin.com')
    const { UNSAFE_getByProps } = render(<BitcoinAddressInput value={''} onChange={onChangeMock} />)
    const clipboardIcon = UNSAFE_getByProps({ id: 'clipboard' })

    await act(() => {
      fireEvent.press(clipboardIcon)
    })
    expect(onChangeMock).toHaveBeenCalledWith('https://peachbitcoin.com')
  })
  it('shows QR scanner when camera icon is pressed', async () => {
    const { UNSAFE_getByProps, toJSON } = render(<BitcoinAddressInput value={fullAddress} />)
    const cameraIcon = UNSAFE_getByProps({ id: 'camera' })

    await waitFor(() => {
      fireEvent.press(cameraIcon)
    })
    expect(toJSON()).toMatchSnapshot()
  })
  it('closes QR scanner when onCancel event is triggered', async () => {
    const { UNSAFE_getByProps, toJSON, UNSAFE_getByType } = render(<BitcoinAddressInput value={fullAddress} />)
    const cameraIcon = UNSAFE_getByProps({ id: 'camera' })
    const { toJSON: toJSON2 } = render(<BitcoinAddressInput value={fullAddress} />)

    await waitFor(() => {
      fireEvent.press(cameraIcon)
    })
    fireEvent(UNSAFE_getByType(ScanQR), 'onCancel')
    expect(toJSON()).toMatchDiffSnapshot(toJSON2())
  })
  it('sets address when QR scanner is successful', async () => {
    const onChangeMock = jest.fn()
    const { UNSAFE_getByProps, UNSAFE_getByType } = render(
      <BitcoinAddressInput value={fullAddress} onChange={onChangeMock} />,
    )
    const cameraIcon = UNSAFE_getByProps({ id: 'camera' })

    await waitFor(() => {
      fireEvent.press(cameraIcon)
    })
    fireEvent(UNSAFE_getByType(ScanQR), 'onRead', { data: fullAddress })
    expect(onChangeMock).toHaveBeenCalledWith(fullAddress)
  })
  it('sets address when QR scanner is successful and it is not a valid bitcoin address', async () => {
    const onChangeMock = jest.fn()
    const { UNSAFE_getByProps, UNSAFE_getByType } = render(
      <BitcoinAddressInput value={fullAddress} onChange={onChangeMock} />,
    )
    const cameraIcon = UNSAFE_getByProps({ id: 'camera' })
    await waitFor(() => {
      fireEvent.press(cameraIcon)
    })
    fireEvent(UNSAFE_getByType(ScanQR), 'onRead', { data: 'https://peachbitcoin.com' })
    expect(onChangeMock).toHaveBeenCalledWith('https://peachbitcoin.com')
  })
  it('requests permissions when the camera icon is pressed on iOS', async () => {
    const { UNSAFE_getByProps } = render(<BitcoinAddressInput value={fullAddress} />)
    const cameraIcon = UNSAFE_getByProps({ id: 'camera' })

    await waitFor(() => {
      fireEvent.press(cameraIcon)
    })
    expect(permissions.request).toHaveBeenCalledWith('ios.permission.CAMERA')
  })
  it("doesn't show the QR scanner when permissions haven't been granted", async () => {
    const requestSpy = jest.spyOn(permissions, 'request')
    requestSpy.mockImplementationOnce(() => Promise.resolve(RESULTS.DENIED))
    const { UNSAFE_getByProps, toJSON } = render(<BitcoinAddressInput value={fullAddress} />)
    const cameraIcon = UNSAFE_getByProps({ id: 'camera' })

    await waitFor(() => {
      fireEvent.press(cameraIcon)
    })
    const { toJSON: toJSON2 } = render(<BitcoinAddressInput value={fullAddress} />)
    expect(toJSON()).toMatchDiffSnapshot(toJSON2())
  })
})
