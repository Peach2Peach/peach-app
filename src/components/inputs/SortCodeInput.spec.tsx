import { SortCodeInput } from './SortCodeInput'
import { createRenderer } from 'react-test-renderer/shallow'

describe('SortCodeInput', () => {
  it('renders correctly', () => {
    const renderer = createRenderer()
    renderer.render(<SortCodeInput />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
})
