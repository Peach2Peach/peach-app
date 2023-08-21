import { fireEvent, render } from '@testing-library/react-native'
import { contractSummary } from '../../../../../tests/unit/data/contractSummaryData'
import { NavigationWrapper } from '../../../../../tests/unit/helpers/NavigationWrapper'
import { TradeIdBubble } from './TradeIdBubble'

const goToContract = jest.fn()
const useNavigateToOfferOrContractMock = jest.fn().mockReturnValue(goToContract)
jest.mock('../../../../hooks/useNavigateToOfferOrContract', () => ({
  useNavigateToOfferOrContract: (...args: unknown[]) => useNavigateToOfferOrContractMock(...args),
}))

const wrapper = NavigationWrapper

describe('TradeIdBubble', () => {
  it('renders correctly', () => {
    const { toJSON } = render(<TradeIdBubble trade={contractSummary} />, { wrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('calls bump fees', () => {
    const { getByText } = render(<TradeIdBubble trade={contractSummary} />, { wrapper })
    fireEvent.press(getByText('PC‑7B‑1C8'))

    expect(useNavigateToOfferOrContractMock).toHaveBeenCalledWith(contractSummary)
    expect(goToContract).toHaveBeenCalled()
  })
})
