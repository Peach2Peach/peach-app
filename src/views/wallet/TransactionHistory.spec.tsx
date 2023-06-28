import ShallowRenderer from 'react-test-renderer/shallow'
import { TransactionHistory } from './TransactionHistory'
import { mockDimensions } from '../../../tests/unit/helpers/mockDimensions'
import { confirmedTransactionSummary, pendingTransactionSummary } from '../../../tests/unit/data/transactionDetailData'

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
  const renderer = ShallowRenderer.createRenderer()

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
})
