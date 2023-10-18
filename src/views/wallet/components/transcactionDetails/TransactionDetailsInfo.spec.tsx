import { View } from 'react-native'
import { createRenderer } from 'react-test-renderer/shallow'
import { fireEvent, render } from 'test-utils'
import {
  confirmedTransactionSummary,
  pendingTransactionSummary,
} from '../../../../../tests/unit/data/transactionDetailData'
import { TransactionDetailsInfo } from './TransactionDetailsInfo'

jest.mock('../../../../components/animation/Fade', () => ({
  Fade: (_props: { show: boolean }) => <View />,
}))

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
  useTransactionDetailsInfoSetup: (...args: unknown[]) => useTransactionDetailsInfoSetupMock(...args),
}))

jest.useFakeTimers()

describe('TransactionDetailsInfo', () => {
  const renderer = createRenderer()
  it('should render correctly for a pending transaction', () => {
    renderer.render(<TransactionDetailsInfo transaction={pendingTransactionSummary} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render correctly for a confirmed transaction', () => {
    useTransactionDetailsInfoSetupMock.mockReturnValueOnce({
      ...useTransactionDetailsInfoSetupReturnValue,
      canBumpFees: false,
    })

    renderer.render(<TransactionDetailsInfo transaction={confirmedTransactionSummary} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })

  it('should go to increase network fee screen if rbf is possible', () => {
    const { getByText } = render(<TransactionDetailsInfo transaction={pendingTransactionSummary} />)
    fireEvent(getByText('increase network fee'), 'onPress')
    expect(goToBumpNetworkFeesMock).toHaveBeenCalled()
  })
})
