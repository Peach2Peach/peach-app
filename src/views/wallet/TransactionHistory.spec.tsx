import { createRenderer } from 'react-test-renderer/shallow'
import { fireEvent, render } from 'test-utils'
import { confirmedTransactionSummary, pendingTransactionSummary } from '../../../tests/unit/data/transactionDetailData'
import { navigateMock } from '../../../tests/unit/helpers/NavigationWrapper'
import { mockDimensions } from '../../../tests/unit/helpers/mockDimensions'
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
  const renderer = createRenderer()

  it('should render correctly when empty', () => {
    useTransactionHistorySetupMock.mockReturnValueOnce({
      ...useTransactionHistorySetupData,
      transactions: [],
    })
    mockDimensions({ width: 320, height: 600 })

    renderer.render(<TransactionHistory />)

    const renderOutput = renderer.getRenderOutput()
    expect(renderOutput).toMatchSnapshot()
  })
  it('should render correctly with tx', () => {
    mockDimensions({ width: 320, height: 600 })

    renderer.render(<TransactionHistory />)

    const renderOutput = renderer.getRenderOutput()
    expect(renderOutput).toMatchSnapshot()
  })
  it('should render medium screens correctly', () => {
    mockDimensions({ width: 600, height: 840 })

    renderer.render(<TransactionHistory />)

    const renderOutput = renderer.getRenderOutput()
    expect(renderOutput).toMatchSnapshot()
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
