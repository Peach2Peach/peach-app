import { NavigationContainer } from '@react-navigation/native'
import { createRenderer } from 'react-test-renderer/shallow'
import {
  confirmedTransactionSummary,
  pendingTransactionSummary,
} from '../../../../../tests/unit/data/transactionDetailData'
import { TransactionDetailsInfo } from './TransactionDetailsInfo'

const wrapper = NavigationContainer

describe('TransactionDetailsInfo', () => {
  const renderer = createRenderer()
  it('should render correctly for a pending transaction', () => {
    renderer.render(<TransactionDetailsInfo transaction={pendingTransactionSummary} />, { wrapper })
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render correctly for a confirmed transaction', () => {
    renderer.render(<TransactionDetailsInfo transaction={confirmedTransactionSummary} />, { wrapper })
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render correctly with a receiving address', () => {
    renderer.render(
      <TransactionDetailsInfo transaction={confirmedTransactionSummary} receivingAddress="receivingAddress" />,
      { wrapper },
    )
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
