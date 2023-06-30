import ShallowRenderer from 'react-test-renderer/shallow'
import { Disputes } from './Disputes'

describe('Disputes', () => {
  const renderer = ShallowRenderer.createRenderer()
  it('should render correctly', () => {
    renderer.render(<Disputes opened={1} won={2} lost={3} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
