import { TradeStuff } from './TradeStuff'
import { createRenderer } from 'react-test-renderer/shallow'

describe('TradeStuff', () => {
  const renderer = createRenderer()
  it('renders correctly', () => {
    renderer.render(
      <TradeStuff
        contract={
          {
            paymentMethod: 'sepa',
            escrow: '0x123',
            releaseTxId: '0x123',
            disputeActive: false,
          } as Contract
        }
      />,
    )
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly when the paymentmethod includes cash', () => {
    renderer.render(
      <TradeStuff
        contract={
          {
            paymentMethod: 'cash.DE',
            escrow: '0x123',
            releaseTxId: '0x123',
            disputeActive: false,
          } as unknown as Contract
        }
      />,
    )
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('doesn\'t show the escrow when the releaseTxId and the escrow are not set', () => {
    renderer.render(
      <TradeStuff
        contract={
          {
            paymentMethod: 'sepa',
            escrow: '',
            releaseTxId: undefined,
            disputeActive: false,
          } as Contract
        }
      />,
    )
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
