import { createRenderer } from 'react-test-renderer/shallow'
import { PercentageInput } from './PercentageInput'

describe('PercentageInput', () => {
  const renderer = createRenderer()
  it('renders correctly', () => {
    renderer.render(<PercentageInput />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
