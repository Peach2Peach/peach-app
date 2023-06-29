import { render } from '@testing-library/react-native'
import { confirmedTransactionSummary } from '../../../tests/unit/data/transactionDetailData'
import { NavigationAndQueryClientWrapper } from '../../../tests/unit/helpers/NavigationAndQueryClientWrapper'
import { TransactionDetails } from './TransactionDetails'

const openInExplorerMock = jest.fn()
const refreshMock = jest.fn()
const goToBumpNetworkFeesMock = jest.fn()
const transactionDetailsSetupReturnValue = {
  transaction: confirmedTransactionSummary,
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

const wrapper = NavigationAndQueryClientWrapper

describe('TransactionDetails', () => {
  it('renders correctly', () => {
    const { toJSON } = render(<TransactionDetails />, { wrapper })
    expect(toJSON()).toMatchSnapshot()
  })
})
