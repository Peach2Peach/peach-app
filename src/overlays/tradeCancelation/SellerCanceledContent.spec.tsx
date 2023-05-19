import { SellerCanceledContent } from './SellerCanceledContent'
import { createRenderer } from 'react-test-renderer/shallow'

describe('SellerCanceledContent', () => {
  const renderer = createRenderer()
  it('should render RefundOrRepublishCashTrade when isCash and canRepublish are true', () => {
    renderer.render(<SellerCanceledContent isCash={true} canRepublish={true} tradeID="123" walletName="walletName" />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render RefundCashTrade when isCash is true and canRepublish is false', () => {
    renderer.render(<SellerCanceledContent isCash={true} canRepublish={false} tradeID="123" walletName="walletName" />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render RequestSent when isCash is false', () => {
    renderer.render(<SellerCanceledContent isCash={false} canRepublish={false} tradeID="123" walletName="walletName" />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
