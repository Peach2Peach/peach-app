import { LabelInput } from './LabelInput'
import { createRenderer } from 'react-test-renderer/shallow'

describe('LabelInput', () => {
  it('renders correctly', () => {
    const renderer = createRenderer()
    renderer.render(<LabelInput />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
})
