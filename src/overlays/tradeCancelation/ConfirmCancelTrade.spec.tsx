import { createRenderer } from 'react-test-renderer/shallow'
import { contract } from '../../../tests/unit/data/contractData'
import { ConfirmCancelTrade } from './ConfirmCancelTrade'

describe('ConfirmCancelTrade', () => {
  const cashTrade = { ...contract, paymentMethod: 'cash.de.bitcoin-weisswurscht' as PaymentMethod }

  it('should render correctly for buyer', () => {
    const renderer = createRenderer()
    renderer.render(<ConfirmCancelTrade {...{ contract, view: 'buyer' }} />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('should render correctly for seller', () => {
    const renderer = createRenderer()
    renderer.render(<ConfirmCancelTrade {...{ contract, view: 'seller' }} />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('should render correctly for buyer with cash trade', () => {
    const renderer = createRenderer()
    renderer.render(<ConfirmCancelTrade {...{ contract: cashTrade, view: 'buyer' }} />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('should render correctly for seller with cash trade', () => {
    const renderer = createRenderer()
    renderer.render(<ConfirmCancelTrade {...{ contract: cashTrade, view: 'seller' }} />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
})
