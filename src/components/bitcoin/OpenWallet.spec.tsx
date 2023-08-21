import { fireEvent, render } from '@testing-library/react-native'
import { openInWallet } from '../../utils/bitcoin'
import { OpenWallet } from './OpenWallet'

jest.mock('../../utils/bitcoin/openInWallet', () => ({
  openInWallet: jest.fn(),
}))

describe('OpenWallet', () => {
  const address = 'address'

  it('should call openInWallet with address', () => {
    const { getByText } = render(<OpenWallet {...{ address }} />)
    const textElement = getByText('open wallet app')
    fireEvent.press(textElement)
    expect(openInWallet).toHaveBeenCalledWith(`bitcoin:${address}`)
  })
  it('should call openInWallet without address', () => {
    const { getByText } = render(<OpenWallet />)
    const textElement = getByText('open wallet app')
    fireEvent.press(textElement)
    expect(openInWallet).toHaveBeenCalledWith('bitcoin:')
  })

  it('should render correctly', () => {
    const { toJSON } = render(<OpenWallet />)
    expect(toJSON()).toMatchSnapshot()
  })
})
