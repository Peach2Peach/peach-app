import { View } from 'react-native'
import { createRenderer } from 'react-test-renderer/shallow'
import { pendingTransactionSummary } from '../../../../../tests/unit/data/transactionDetailData'
import { OutputInfo } from './OutputInfo'

jest.mock('../../../../components/animation/Fade', () => ({
  Fade: (_props: { show: boolean }) => <View />,
}))

jest.useFakeTimers()

describe('OutputInfo', () => {
  const offerData = pendingTransactionSummary.offerData[0]
  const renderer = createRenderer()
  it('should render correctly', () => {
    renderer.render(<OutputInfo transaction={pendingTransactionSummary} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render correctly with multiple offers', () => {
    renderer.render(<OutputInfo transaction={{ ...pendingTransactionSummary, offerData: [offerData, offerData] }} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render correctly with multiple contracts', () => {
    const offerDataWithContract = {
      ...offerData,
      contractId: '123-456',
      currency: 'EUR' as Currency,
      price: 394,
    }
    renderer.render(
      <OutputInfo
        transaction={{ ...pendingTransactionSummary, offerData: [offerDataWithContract, offerDataWithContract] }}
      />,
    )
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render correctly without offerData', () => {
    renderer.render(<OutputInfo transaction={{ ...pendingTransactionSummary, offerData: [] }} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
