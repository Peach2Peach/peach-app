import { createRenderer } from 'react-test-renderer/shallow'
import { TurnOffBatching } from './TurnOffBatching'

describe('TurnOffBatching', () => {
  const shallowRenderer = createRenderer()
  it('should render correctly', () => {
    shallowRenderer.render(<TurnOffBatching />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
})
