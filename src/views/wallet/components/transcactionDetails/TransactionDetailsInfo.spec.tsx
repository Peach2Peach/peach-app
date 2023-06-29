import { NavigationContainer } from '@react-navigation/native'
import { createRenderer } from 'react-test-renderer/shallow'
import {
  confirmedTransactionSummary,
  pendingTransactionSummary,
} from '../../../../../tests/unit/data/transactionDetailData'
import { TransactionDetailsInfo } from './TransactionDetailsInfo'

const wrapper = NavigationContainer

const receivingAddress = 'receivingAddress'
const goToBumpNetworkFeesMock = jest.fn()
const openInExplorerMock = jest.fn()
const useTransactionDetailsInfoSetupReturnValue = {
  receivingAddress,
  canBumpFees: true,
  goToBumpNetworkFees: goToBumpNetworkFeesMock,
  openInExplorer: openInExplorerMock,
}
const useTransactionDetailsInfoSetupMock = jest.fn().mockReturnValue(useTransactionDetailsInfoSetupReturnValue)
jest.mock('../../hooks/useTransactionDetailsInfoSetup', () => ({
  useTransactionDetailsInfoSetup: (...args: any[]) => useTransactionDetailsInfoSetupMock(...args),
}))

describe('TransactionDetailsInfo', () => {
  const renderer = createRenderer()
  it('should render correctly for a pending transaction', () => {
    renderer.render(<TransactionDetailsInfo transaction={pendingTransactionSummary} />, { wrapper })
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render correctly for a confirmed transaction', () => {
    useTransactionDetailsInfoSetupMock.mockReturnValueOnce({
      ...useTransactionDetailsInfoSetupReturnValue,
      canBumpFees: false,
    })

    renderer.render(<TransactionDetailsInfo transaction={confirmedTransactionSummary} />, { wrapper })
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
