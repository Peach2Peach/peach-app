import { NavigationContainer } from '@react-navigation/native'
import { fireEvent, render } from 'test-utils'
import { feeEstimates } from '../../../../../tests/unit/data/electrumData'
import { bitcoinTransaction, pendingTransactionSummary } from '../../../../../tests/unit/data/transactionDetailData'
import { placeholderFeeEstimates } from '../../../../hooks/query/useFeeEstimates'
import { usePopupStore } from '../../../../store/usePopupStore'
import { TransactionETASummaryItem } from './TransactionETASummaryItem'

const wrapper = NavigationContainer

const useTransactionDetailsMock = jest.fn().mockReturnValue({
  transaction: bitcoinTransaction,
})
jest.mock('../../../../hooks/query/useTransactionDetails', () => ({
  useTransactionDetails: (...args: unknown[]) => useTransactionDetailsMock(...args),
}))

const useFeeEstimatesMock = jest.fn().mockReturnValue({ feeEstimates: placeholderFeeEstimates })
jest.mock('../../../../hooks/query/useFeeEstimates', () => ({
  ...jest.requireActual('../../../../hooks/query/useFeeEstimates'),
  useFeeEstimates: () => useFeeEstimatesMock(),
}))

describe('TransactionETA', () => {
  it('should render correctly for 1 block ETA', () => {
    const { toJSON } = render(<TransactionETASummaryItem txId={pendingTransactionSummary.id} />, { wrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly for more than 1 block ETA', () => {
    useFeeEstimatesMock.mockReturnValueOnce({ feeEstimates })

    const { toJSON } = render(<TransactionETASummaryItem txId={pendingTransactionSummary.id} />, { wrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('should open help popup', () => {
    const { getByText } = render(<TransactionETASummaryItem txId={pendingTransactionSummary.id} />, { wrapper })
    fireEvent.press(getByText('in 1 block'))
    const popupComponent = usePopupStore.getState().popupComponent || <></>
    expect(render(popupComponent, { wrapper }).toJSON()).toMatchSnapshot()
  })
})
