import { createRenderer } from 'react-test-renderer/shallow'
import { ReferenceInput } from './ReferenceInput'

describe('ReferenceInput', () => {
  it('renders correctly', () => {
    const renderer = createRenderer()
    renderer.render(<ReferenceInput />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
