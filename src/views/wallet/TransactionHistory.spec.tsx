import { fireEvent, render } from 'test-utils'
import { confirmedTransactionSummary, pendingTransactionSummary } from '../../../tests/unit/data/transactionDetailData'
import { navigateMock } from '../../../tests/unit/helpers/NavigationWrapper'
import { TransactionHistory } from './TransactionHistory'

const transactions: TransactionSummary[] = [pendingTransactionSummary, confirmedTransactionSummary]
const refreshMock = jest.fn()
const useTransactionHistorySetupData = {
  transactions,
  refresh: refreshMock,
  isRefreshing: false,
}
const useTransactionHistorySetupMock = jest.fn().mockReturnValue(useTransactionHistorySetupData)
jest.mock('./hooks/useTransactionHistorySetup', () => ({
  useTransactionHistorySetup: () => useTransactionHistorySetupMock(),
}))

describe('TransactionHistory', () => {
  it('should render correctly when empty', () => {
    useTransactionHistorySetupMock.mockReturnValueOnce({
      ...useTransactionHistorySetupData,
      transactions: [],
    })
    const { toJSON } = render(<TransactionHistory />)

    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly with tx', () => {
    const { toJSON } = render(<TransactionHistory />)

    expect(toJSON()).toMatchSnapshot()
  })
  it('should navigate to "exportTransactionHistory" when share icon is pressed', () => {
    useTransactionHistorySetupMock.mockReturnValueOnce({
      ...useTransactionHistorySetupData,
      transactions: [],
    })
    const { getByAccessibilityHint } = render(<TransactionHistory />)
    const shareIcon = getByAccessibilityHint('go to export transaction history')
    fireEvent.press(shareIcon)

    expect(navigateMock).toHaveBeenCalledWith('exportTransactionHistory')
  })
})
