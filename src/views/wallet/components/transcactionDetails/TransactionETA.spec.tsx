import { NavigationContainer } from '@react-navigation/native'
import { createRenderer } from 'react-test-renderer/shallow'
import {
  bitcoinTransaction,
  confirmedTransactionSummary,
  pendingTransactionSummary,
} from '../../../../../tests/unit/data/transactionDetailData'
import { TransactionETA } from './TransactionETA'
import { feeEstimates } from '../../../../../tests/unit/data/electrumData'
import { placeholderFeeEstimates } from '../../../../hooks/query/useFeeEstimates'

const wrapper = NavigationContainer

const useTransactionDetailsMock = jest.fn().mockReturnValue({
  transaction: bitcoinTransaction,
})
jest.mock('../../../../hooks/query/useTransactionDetails', () => ({
  useTransactionDetails: (...args: any[]) => useTransactionDetailsMock(...args),
}))

const useFeeEstimatesMock = jest.fn().mockReturnValue({ feeEstimates: placeholderFeeEstimates })
jest.mock('../../../../hooks/query/useFeeEstimates', () => ({
  ...jest.requireActual('../../../../hooks/query/useFeeEstimates'),
  useFeeEstimates: () => useFeeEstimatesMock(),
}))

describe('TransactionETA', () => {
  const renderer = createRenderer()
  it('should render correctly for 1 block ETA', () => {
    renderer.render(<TransactionETA txId={pendingTransactionSummary.id} />, { wrapper })
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render correctly for more than 1 block ETA', () => {
    useFeeEstimatesMock.mockReturnValueOnce({ feeEstimates })

    renderer.render(<TransactionETA txId={pendingTransactionSummary.id} />, { wrapper })
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
