import { render } from 'test-utils'
import { account1 } from '../../../../../tests/unit/data/accountData'
import { contractSummary } from '../../../../../tests/unit/data/contractSummaryData'
import { updateAccount } from '../../../../utils/account'
import { TradeItem } from './TradeItem'

jest.useFakeTimers()

jest.mock('../../../../components/statusCard', () => ({
  StatusCard: 'StatusCard',
}))

describe('OfferItem', () => {
  const minAmount = 21000
  const maxAmount = 210000
  const defaultOffer: OfferSummary = {
    id: 'id',
    type: 'bid',
    creationDate: new Date('2021-01-01'),
    lastModified: new Date('2021-01-01'),
    amount: [minAmount, maxAmount],
    matches: [],
    tradeStatus: 'searchingForPeer',
  }

  it('should render correctly', () => {
    const { toJSON } = render(<TradeItem item={defaultOffer} />)
    expect(toJSON()).toMatchSnapshot()
  })
  it("should render correctly if it's a past offer", () => {
    const { toJSON } = render(<TradeItem item={{ ...defaultOffer, tradeStatus: 'tradeCompleted' }} />)
    expect(toJSON()).toMatchSnapshot()
  })
})

describe('ContractItem', () => {
  beforeAll(() => {
    updateAccount(account1)
  })

  it('should render correctly', () => {
    const { toJSON } = render(<TradeItem item={{ ...contractSummary, tradeStatus: 'paymentRequired' }} />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly with unread messages', () => {
    const { toJSON } = render(
      <TradeItem item={{ ...contractSummary, tradeStatus: 'paymentRequired', unreadMessages: 1 }} />,
    )
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly with past contract', () => {
    const { toJSON } = render(<TradeItem item={{ ...contractSummary, tradeStatus: 'tradeCompleted' }} />)
    expect(toJSON()).toMatchSnapshot()
  })
})
