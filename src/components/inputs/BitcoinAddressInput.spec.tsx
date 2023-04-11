import { BitcoinAddressInput } from './BitcoinAddressInput'
import { render, fireEvent, act } from '@testing-library/react-native'
import i18n from '../../utils/i18n'
import Clipboard from '@react-native-clipboard/clipboard'
import { Text } from '../text'

jest.mock('../camera/ScanQR', () => 'ScanQR')
jest.mock('../Icon', () => {
  const Icon = ({ id, ...rest }: { id: string }) => <Text {...rest}>{id}</Text>

  return Icon
})

describe('BitcoinAddressInput', () => {
  const fullAddress = 'bc1qcj5yzmk8mjynz5vyxmre5zsgtntkwkcgn57r7z'
  it('renders correctly', () => {
    const { toJSON } = render(<BitcoinAddressInput value={fullAddress} />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('shows full address when focused', () => {
    const { getByPlaceholderText, toJSON } = render(<BitcoinAddressInput value={fullAddress} />)
    const input = getByPlaceholderText(i18n('form.address.btc.placeholder'))

    fireEvent(input, 'focus')
    expect(toJSON()).toMatchSnapshot()
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
    const { getByText } = render(<BitcoinAddressInput value={''} onChange={onChangeMock} />)
    const clipboardIcon = getByText('clipboard')

    await act(() => {
      fireEvent.press(clipboardIcon)
    })
    expect(onChangeMock).toHaveBeenCalledWith(fullAddress)
  })
  it('pastes clipboard value if it is not a valid bitcoin address', async () => {
    const onChangeMock = jest.fn()
    Clipboard.setString('https://peachbitcoin.com')
    const { getByText } = render(<BitcoinAddressInput value={''} onChange={onChangeMock} />)
    const clipboardIcon = getByText('clipboard')

    await act(() => {
      fireEvent.press(clipboardIcon)
    })
    expect(onChangeMock).toHaveBeenCalledWith('https://peachbitcoin.com')
  })
  it('shows QR scanner when camera icon is pressed', () => {
    const { getByText, toJSON } = render(<BitcoinAddressInput value={fullAddress} />)
    const cameraIcon = getByText('camera')

    fireEvent.press(cameraIcon)
    expect(toJSON()).toMatchSnapshot()
  })
  it('closes QR scanner when onCancel event is triggered', () => {
    const { getByText, toJSON, getByTestId } = render(<BitcoinAddressInput value={fullAddress} />)
    const cameraIcon = getByText('camera')
    const { toJSON: toJSON2 } = render(<BitcoinAddressInput value={fullAddress} />)

    fireEvent.press(cameraIcon)
    fireEvent(getByTestId('qr-code-scanner'), 'onCancel')
    expect(JSON.stringify(toJSON())).toBe(JSON.stringify(toJSON2()))
  })
  it('sets address when QR scanner is successful', () => {
    const onChangeMock = jest.fn()
    const { getByText, getByTestId } = render(<BitcoinAddressInput value={fullAddress} onChange={onChangeMock} />)
    const cameraIcon = getByText('camera')

    fireEvent.press(cameraIcon)
    fireEvent(getByTestId('qr-code-scanner'), 'onSuccess', { data: fullAddress })
    expect(onChangeMock).toHaveBeenCalledWith(fullAddress)
  })
  it('sets address when QR scanner is successful and it is not a valid bitcoin address', () => {
    const onChangeMock = jest.fn()
    const { getByText, getByTestId } = render(<BitcoinAddressInput value={fullAddress} onChange={onChangeMock} />)
    const cameraIcon = getByText('camera')

    fireEvent.press(cameraIcon)
    fireEvent(getByTestId('qr-code-scanner'), 'onSuccess', { data: 'https://peachbitcoin.com' })
    expect(onChangeMock).toHaveBeenCalledWith('https://peachbitcoin.com')
  })
})
