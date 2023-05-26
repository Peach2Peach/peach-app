import { Escrow } from './Escrow'
import { fireEvent, render } from '@testing-library/react-native'
import { createRenderer } from 'react-test-renderer/shallow'
import i18n from '../../../utils/i18n'
import { Linking } from 'react-native'

const useContractContextMock = jest.fn()
jest.mock('../context', () => ({
  useContractContext: () => useContractContextMock(),
}))

describe('Escrow', () => {
  const renderer = createRenderer()

  afterEach(() => {
    jest.clearAllMocks()
  })
  it('renders correctly', () => {
    const mockContract = { releaseTxId: undefined, escrow: '123', disputeActive: false } as Contract
    useContractContextMock.mockReturnValueOnce({ contract: mockContract })
    renderer.render(<Escrow />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly with an active dispute', () => {
    const mockContract = { releaseTxId: undefined, escrow: '123', disputeActive: true } as Contract
    useContractContextMock.mockReturnValueOnce({ contract: mockContract })
    renderer.render(<Escrow />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('opens a link with the releaseTxId when it is present', () => {
    const mockContract = { releaseTxId: '123', escrow: '123', disputeActive: false } as Contract
    useContractContextMock.mockReturnValueOnce({ contract: mockContract })
    const { getByText } = render(<Escrow />)
    fireEvent.press(getByText(i18n('escrow')))
    expect(Linking.openURL).toHaveBeenCalledWith('https://localhost:3000/tx/123')
  })
  it('opens a link with the escrow address when the releaseTxId is not present', () => {
    const mockContract = { releaseTxId: undefined, escrow: '123', disputeActive: false } as Contract
    useContractContextMock.mockReturnValueOnce({ contract: mockContract })
    const { getByText } = render(<Escrow />)
    fireEvent.press(getByText(i18n('escrow')))
    expect(Linking.openURL).toHaveBeenCalledWith('https://localhost:3000/address/123')
  })
})
