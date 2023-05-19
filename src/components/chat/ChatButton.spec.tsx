import { ChatButton } from './ChatButton'
import { fireEvent, render } from '@testing-library/react-native'
import i18n from '../../utils/i18n'
import { NavigationWrapper, pushMock } from '../../../tests/unit/helpers/NavigationWrapper'

const useContractContextMock = jest.fn()
jest.mock('../../views/contract/context/useContractContext', () => ({
  useContractContext: () => useContractContextMock(),
}))

describe('ChatButton', () => {
  it('renders correctly', () => {
    const mockContract = {
      unreadMessages: 0,
      id: '123',
      disputeActive: false,
    } as Contract
    useContractContextMock.mockReturnValue({ contract: mockContract })
    const { toJSON } = render(<ChatButton />, { wrapper: NavigationWrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('renders correctly with active dispute', () => {
    const mockContract = {
      unreadMessages: 0,
      id: '123',
      disputeActive: true,
    } as Contract
    useContractContextMock.mockReturnValue({ contract: mockContract })
    const { toJSON } = render(<ChatButton />, { wrapper: NavigationWrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('should navigate to chat screen when pressed', () => {
    const mockContract = {
      unreadMessages: 0,
      id: '123',
      disputeActive: false,
    } as Contract
    useContractContextMock.mockReturnValue({ contract: mockContract })
    const { getByText } = render(<ChatButton />, {
      wrapper: NavigationWrapper,
    })
    fireEvent.press(getByText(i18n('chat')))
    expect(pushMock).toHaveBeenCalledWith('contractChat', { contractId: '123' })
  })
})
