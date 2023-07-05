import { fireEvent, render } from '@testing-library/react-native'
import { NavigationAndQueryClientWrapper } from '../../../../../tests/unit/helpers/NavigationAndQueryClientWrapper'
import { useTradeSummaryStore } from '../../../../store/tradeSummaryStore'
import { TransactionHeader } from './TransactionHeader'

const wrapper = NavigationAndQueryClientWrapper

const goToOfferMock = jest.fn()
const navigateToOfferOrContractMock = jest.fn().mockReturnValue(goToOfferMock)
jest.mock('../../../../hooks/useNavigateToOfferOrContract', () => ({
  useNavigateToOfferOrContract: (...args: any[]) => navigateToOfferOrContractMock(...args),
}))

describe('TransactionHeader', () => {
  const offerSummary = {
    id: '123',
  }
  const contractSummary = {
    id: '123-456',
  }

  beforeAll(() => {
    useTradeSummaryStore.getState().setContract(contractSummary.id, contractSummary)
    useTradeSummaryStore.getState().setOffer(offerSummary.id, offerSummary)
  })
  it('should render correctly buy trade', () => {
    const { toJSON } = render(<TransactionHeader type="TRADE" contractId={contractSummary.id} />, { wrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly for a receiving transaction', () => {
    const { toJSON } = render(<TransactionHeader type="DEPOSIT" />, { wrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly for a funding escrow transaction with offer id', () => {
    const { toJSON } = render(<TransactionHeader type="ESCROWFUNDED" offerId={offerSummary.id} />, { wrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly for a funding escrow transaction with contract id', () => {
    const { toJSON } = render(<TransactionHeader type="ESCROWFUNDED" contractId={contractSummary.id} />, { wrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly for an outgoing transaction', () => {
    const { toJSON } = render(<TransactionHeader type="WITHDRAWAL" />, { wrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly for a refund transaction', () => {
    const { toJSON } = render(<TransactionHeader type="REFUND" contractId={contractSummary.id} />, { wrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('should go to contract', () => {
    const { getByText } = render(<TransactionHeader type="REFUND" contractId={contractSummary.id} />, { wrapper })
    expect(navigateToOfferOrContractMock).toHaveBeenCalledWith(contractSummary)
    fireEvent.press(getByText('PC‑7B‑1C8'))
    expect(goToOfferMock).toHaveBeenCalled()
  })
  it('should go to offer', () => {
    const { getByText } = render(<TransactionHeader type="ESCROWFUNDED" offerId={offerSummary.id} />, { wrapper })
    expect(navigateToOfferOrContractMock).toHaveBeenCalledWith(offerSummary)
    fireEvent.press(getByText('P‑7B'))
    expect(goToOfferMock).toHaveBeenCalled()
  })
})
