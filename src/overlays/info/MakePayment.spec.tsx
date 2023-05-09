import ShallowRenderer from 'react-test-renderer/shallow'
import { MakePayment } from './MakePayment'

describe('MakePayment', () => {
  const renderer = ShallowRenderer.createRenderer()
  it('renders correctly', () => {
    renderer.render(<MakePayment />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
