import { render } from '@testing-library/react-native'
import { NavigationWrapper } from '../../../tests/unit/helpers/NavigationWrapper'
import Premium from './Premium'
import { getSellOfferDraft } from './helpers/getSellOfferDraft'
import { QueryClientWrapper } from '../../../tests/unit/helpers/QueryClientWrapper'

const wrapper = ({ children }: ComponentProps) => (
  <NavigationWrapper>
    <QueryClientWrapper>{children}</QueryClientWrapper>
  </NavigationWrapper>
)

jest.useFakeTimers()

describe('Premium', () => {
  const offerDraft = getSellOfferDraft({ sellAmount: 10000, premium: 1.5, meansOfPayment: {}, payoutAddress: '' })
  const setOfferDraft = jest.fn()
  const next = jest.fn()
  it('renders correctly', () => {
    const { toJSON } = render(<Premium {...{ offerDraft, setOfferDraft, next }} />, { wrapper })
    expect(toJSON()).toMatchSnapshot()
  })
})
