import { createRenderer } from 'react-test-renderer/shallow'
import { Checkbox } from './Checkbox'

describe('Checkbox', () => {
  const renderer = createRenderer()
  it('renders correctly when unchecked', () => {
    renderer.render(
      <Checkbox checked={false} onPress={jest.fn()}>
        21 Million
      </Checkbox>,
    )
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('renders correctly when checked', () => {
    renderer.render(
      <Checkbox checked={true} onPress={jest.fn()}>
        21 Million
      </Checkbox>,
    )
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
})
