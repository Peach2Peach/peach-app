import { ChatButton } from './ChatButton'
import { fireEvent, render } from '@testing-library/react-native'
import { NavigationContext } from '@react-navigation/native'
import i18n from '../../utils/i18n'

const pushMock = jest.fn()
const navigationWrapper: React.ComponentType<any> | undefined = ({ children }: any) => (
  // @ts-ignore
  <NavigationContext.Provider value={{ push: pushMock }}>{children}</NavigationContext.Provider>
)

describe('ChatButton', () => {
  it('renders correctly', () => {
    const mockContract = {
      unreadMessages: 0,
      id: '123',
      disputeActive: false,
    } as Contract
    const { toJSON } = render(<ChatButton contract={mockContract} />, { wrapper: navigationWrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('renders correctly with active dispute', () => {
    const mockContract = {
      unreadMessages: 0,
      id: '123',
      disputeActive: true,
    } as Contract
    const { toJSON } = render(<ChatButton contract={mockContract} />, { wrapper: navigationWrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('should navigate to chat screen when pressed', () => {
    const mockContract = {
      unreadMessages: 0,
      id: '123',
      disputeActive: false,
    } as Contract
    const { getByText } = render(<ChatButton contract={mockContract} />, {
      wrapper: navigationWrapper,
    })
    fireEvent.press(getByText(i18n('chat')))
    expect(pushMock).toHaveBeenCalledWith('contractChat', { contractId: '123' })
  })
})
