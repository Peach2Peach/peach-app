import { NavigationContainer } from '@react-navigation/native'
import { createRenderer } from 'react-test-renderer/shallow'
import {
  confirmedTransactionSummary,
  pendingTransactionSummary,
} from '../../../../../tests/unit/data/transactionDetailData'
import { TranscactionDetailsHeader } from './TranscactionDetailsHeader'

const wrapper = NavigationContainer

describe('TranscactionDetailsHeader', () => {
  const renderer = createRenderer()
  it('should render correctly for a pending transaction', () => {
    renderer.render(<TranscactionDetailsHeader transaction={pendingTransactionSummary} />, { wrapper })
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render correctly for a confirmed transaction', () => {
    renderer.render(<TranscactionDetailsHeader transaction={confirmedTransactionSummary} />, { wrapper })
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
