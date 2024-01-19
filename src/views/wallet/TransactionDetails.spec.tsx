import { createRenderer } from 'react-test-renderer/shallow'
import {
  bdkTransactionWithRBF1,
  bitcoinJSTransactionWithRBF1,
  transactionWithRBF1Summary,
} from '../../../tests/unit/data/transactionDetailData'
import { TransactionDetails } from './TransactionDetails'

const openInExplorerMock = jest.fn()
const refreshMock = jest.fn()
const goToBumpNetworkFeesMock = jest.fn()
const transactionDetailsSetupReturnValue = {
  localTx: bdkTransactionWithRBF1,
  transactionSummary: transactionWithRBF1Summary,
  transactionDetails: bitcoinJSTransactionWithRBF1,
  receivingAddress: 'receivingAddress',
  openInExplorer: openInExplorerMock,
  refresh: refreshMock,
  isRefreshing: false,
  canBumpNetworkFees: false,
  goToBumpNetworkFees: goToBumpNetworkFeesMock,
}

const useTransactionDetailsSetupMock = jest.fn().mockReturnValue(transactionDetailsSetupReturnValue)

jest.mock('./hooks/useTransactionDetailsSetup', () => ({
  useTransactionDetailsSetup: () => useTransactionDetailsSetupMock(),
}))

describe('TransactionDetails', () => {
  const renderer = createRenderer()
  it('renders correctly', () => {
    renderer.render(<TransactionDetails />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders loading screen if transaction has not been loaded yet', () => {
    useTransactionDetailsSetupMock.mockReturnValueOnce({
      ...transactionDetailsSetupReturnValue,
      localTx: undefined,
      transactionDetails: undefined,
      transactionSummary: undefined,
    })
    renderer.render(<TransactionDetails />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
