import { createRenderer } from 'react-test-renderer/shallow'
import { TransactionHeader } from './TransactionHeader'

describe('TransactionHeader', () => {
  const renderer = createRenderer()

  it('should render correctly buy trade', () => {
    renderer.render(<TransactionHeader type="TRADE" contractId="123-456" />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render correctly for a receiving transaction', () => {
    renderer.render(<TransactionHeader type="DEPOSIT" />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render correctly for a funding escrow transaction with offer id', () => {
    renderer.render(<TransactionHeader type="ESCROWFUNDED" offerId="123" />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render correctly for a funding escrow transaction with contract id', () => {
    renderer.render(<TransactionHeader type="ESCROWFUNDED" contractId="123-456" />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render correctly for an outgoing transaction', () => {
    renderer.render(<TransactionHeader type="WITHDRAWAL" />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render correctly for a refund transaction', () => {
    renderer.render(<TransactionHeader type="REFUND" contractId="123-456" />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
