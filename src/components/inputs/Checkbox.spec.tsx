import { Checkbox } from './Checkbox'
import { createRenderer } from 'react-test-renderer/shallow'

describe('Checkbox', () => {
  const renderer = createRenderer()
  it('renders correctly when unchecked', () => {
    renderer.render(<Checkbox checked={false} onPress={jest.fn()} text="21 Million" />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('renders correctly when checked', () => {
    renderer.render(<Checkbox checked={true} onPress={jest.fn()} text="21 Million" />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
})
