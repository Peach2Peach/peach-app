import { ContractItem } from './ContractItem'
import { render } from '@testing-library/react-native'
import { NavigationContainer } from '@react-navigation/native'
import { QueryClientWrapper } from '../../../../../tests/unit/helpers/QueryClientWrapper'
import { setAccount } from '../../../../utils/account'
import { account1 } from '../../../../../tests/unit/data/accountData'
import { TradeItem } from './TradeItem'

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientWrapper>
    <NavigationContainer>{children}</NavigationContainer>
  </QueryClientWrapper>
)

jest.useFakeTimers()

describe('ContractItem', () => {
  const contract: ContractSummary = {
    id: 'contractId',
    offerId: 'offerId',
    type: 'bid',
    creationDate: new Date('2021-01-01'),
    lastModified: new Date('2021-01-01'),
    tradeStatus: 'paymentRequired',
    amount: 21000,
    price: 21,
    currency: 'EUR',
    unreadMessages: 0,
  }

  beforeAll(() => {
    setAccount(account1, true)
  })

  it('should render correctly', () => {
    const { toJSON } = render(<TradeItem item={contract} />, { wrapper: TestWrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly with unread messages', () => {
    const { toJSON } = render(<TradeItem item={{ ...contract, unreadMessages: 1 }} />, {
      wrapper: TestWrapper,
    })
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly with past contract', () => {
    const { toJSON } = render(<TradeItem item={{ ...contract, tradeStatus: 'tradeCompleted' }} />, {
      wrapper: TestWrapper,
    })
    expect(toJSON()).toMatchSnapshot()
  })
})
