import { fireEvent, render } from 'test-utils'
import { offerSummary } from '../../../../../tests/unit/data/offerSummaryData'
import { OfferIdBubble } from './OfferIdBubble'

const goToOffer = jest.fn()
const useNavigateToOfferOrContractMock = jest.fn().mockReturnValue(goToOffer)
jest.mock('../../../../hooks/useTradeNavigation', () => ({
  useTradeNavigation: (...args: unknown[]) => useNavigateToOfferOrContractMock(...args),
}))

describe('OfferIdBubble', () => {
  it('renders correctly', () => {
    const { toJSON } = render(<OfferIdBubble offer={offerSummary} />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('calls bump fees', () => {
    const { getByText } = render(<OfferIdBubble offer={offerSummary} />)
    fireEvent.press(getByText('P‑1C8'))

    expect(useNavigateToOfferOrContractMock).toHaveBeenCalledWith(offerSummary)
    expect(goToOffer).toHaveBeenCalled()
  })
})
