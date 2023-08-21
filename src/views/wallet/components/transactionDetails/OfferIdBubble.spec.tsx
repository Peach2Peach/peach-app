import { fireEvent, render } from '@testing-library/react-native'
import { offerSummary } from '../../../../../tests/unit/data/offerSummaryData'
import { NavigationWrapper } from '../../../../../tests/unit/helpers/NavigationWrapper'
import { OfferIdBubble } from './OfferIdBubble'

const goToOffer = jest.fn()
const useNavigateToOfferOrContractMock = jest.fn().mockReturnValue(goToOffer)
jest.mock('../../../../hooks/useNavigateToOfferOrContract', () => ({
  useNavigateToOfferOrContract: (...args: unknown[]) => useNavigateToOfferOrContractMock(...args),
}))

const wrapper = NavigationWrapper

describe('OfferIdBubble', () => {
  it('renders correctly', () => {
    const { toJSON } = render(<OfferIdBubble offer={offerSummary} />, { wrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('calls bump fees', () => {
    const { getByText } = render(<OfferIdBubble offer={offerSummary} />, { wrapper })
    fireEvent.press(getByText('P‑1C8'))

    expect(useNavigateToOfferOrContractMock).toHaveBeenCalledWith(offerSummary)
    expect(goToOffer).toHaveBeenCalled()
  })
})
