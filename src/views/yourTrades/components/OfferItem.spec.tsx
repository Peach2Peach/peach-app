import { OfferItem } from './OfferItem'
import { render } from '@testing-library/react-native'
import { NavigationContainer } from '@react-navigation/native'
import { QueryClientWrapper } from '../../../../tests/unit/helpers/QueryClientWrapper'

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientWrapper>
    <NavigationContainer>{children}</NavigationContainer>
  </QueryClientWrapper>
)

describe('OfferItem', () => {
  const defaultOffer: OfferSummary = {
    id: 'id',
    type: 'bid',
    creationDate: new Date('2021-01-01'),
    lastModified: new Date('2021-01-01'),
    amount: [21000, 210000],
    matches: [],
    prices: {
      EUR: 21,
    },
    tradeStatus: 'searchingForPeer',
  }

  it('should render correctly', () => {
    const { toJSON } = render(<OfferItem offerSummary={defaultOffer} />, { wrapper: TestWrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly if it\'s a past offer', () => {
    const { toJSON } = render(<OfferItem offerSummary={{ ...defaultOffer, tradeStatus: 'tradeCompleted' }} />, {
      wrapper: TestWrapper,
    })
    expect(toJSON()).toMatchSnapshot()
  })
})
