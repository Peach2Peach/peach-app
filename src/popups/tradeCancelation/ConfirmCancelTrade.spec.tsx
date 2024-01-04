import { createRenderer } from 'react-test-renderer/shallow'
import { contract } from '../../../peach-api/src/testData/contract'
import { ConfirmCancelTrade } from './ConfirmCancelTrade'

describe('ConfirmCancelTrade', () => {
  const cashTrade = { ...contract, paymentMethod: 'cash.de.bitcoin-weisswurscht' as PaymentMethod }

  const renderer = createRenderer()
  it('should render correctly for buyer', () => {
    renderer.render(<ConfirmCancelTrade {...{ contract, view: 'buyer' }} />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('should render correctly for seller', () => {
    renderer.render(<ConfirmCancelTrade {...{ contract, view: 'seller' }} />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('should render correctly for buyer with cash trade', () => {
    renderer.render(<ConfirmCancelTrade {...{ contract: cashTrade, view: 'buyer' }} />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('should render correctly for seller with cash trade', () => {
    renderer.render(<ConfirmCancelTrade {...{ contract: cashTrade, view: 'seller' }} />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
})
