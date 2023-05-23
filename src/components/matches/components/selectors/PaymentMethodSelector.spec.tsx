import { createRenderer } from 'react-test-renderer/shallow'
import { PaymentMethodSelector } from './PaymentMethodSelector'

describe('PaymentMethodSelector', () => {
  const renderer = createRenderer()
  it('should render correctly', () => {
    renderer.render(<PaymentMethodSelector {...{ matchId: '1', disabled: false }} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render correctly when disabled', () => {
    renderer.render(<PaymentMethodSelector {...{ matchId: '1', disabled: true }} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
