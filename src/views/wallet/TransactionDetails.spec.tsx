import { createRenderer } from 'react-test-renderer/shallow'
import { confirmedTransactionSummary } from '../../../tests/unit/data/transactionDetailData'
import { TransactionDetails } from './TransactionDetails'

const useTransactionDetailsSetupMock = jest.fn().mockReturnValue({
  transaction: confirmedTransactionSummary,
})

jest.mock('./hooks/useTransactionDetailsSetup', () => ({
  useTransactionDetailsSetup: () => useTransactionDetailsSetupMock(),
}))

jest.mock('./hooks/useSyncWallet', () => ({
  useSyncWallet: jest.fn(() => ({ refetch: jest.fn(), isRefetching: false })),
}))

describe('TransactionDetails', () => {
  const renderer = createRenderer()
  it('renders correctly', () => {
    renderer.render(<TransactionDetails />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
