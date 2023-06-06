import { createRenderer } from 'react-test-renderer/shallow'
import { Refund } from './Refund'

describe('Refund', () => {
  const shallowRenderer = createRenderer()
  it('should render correctly when peach wallet is active', () => {
    shallowRenderer.render(<Refund isPeachWallet={true} />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render correctly when peach wallet is not active', () => {
    shallowRenderer.render(<Refund isPeachWallet={false} />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
})
