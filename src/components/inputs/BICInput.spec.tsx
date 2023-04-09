import { createRenderer } from 'react-test-renderer/shallow'
import { BICInput } from './BICInput'

describe('BICInput', () => {
  it('renders correctly', () => {
    const renderer = createRenderer()
    renderer.render(<BICInput />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
