import { createRenderer } from 'react-test-renderer/shallow'
import { confirmedTransactionSummary } from '../../../tests/unit/data/transactionDetailData'
import { TransactionDetails } from './TransactionDetails'
import { fireEvent, render } from '@testing-library/react-native'

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

describe('TransactionDetails', () => {
  const renderer = createRenderer()
  it('renders correctly', () => {
    renderer.render(<TransactionDetails />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should go to increase network fee screen if rbf is possible', () => {
    useTransactionDetailsSetupMock.mockReturnValueOnce({
      ...transactionDetailsSetupReturnValue,
      canBumpNetworkFees: true,
    })

    const { getByText } = render(<TransactionDetails />)
    fireEvent(getByText('increase network fee'), 'onPress')
    expect(goToBumpNetworkFeesMock).toHaveBeenCalled()
  })
})
