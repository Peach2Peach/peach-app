import { createRenderer } from 'react-test-renderer/shallow'
import { Text } from '../text'
import { RadioButtonItem } from './RadioButtonItem'

describe('RadioButtonItem', () => {
  const renderer = createRenderer()
  it('renders correctly when selected', () => {
    renderer.render(<RadioButtonItem display="EUR" selected />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('renders correctly when not selected', () => {
    renderer.render(<RadioButtonItem display="EUR" selected={false} />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('renders correctly when disabled', () => {
    renderer.render(<RadioButtonItem display="EUR" selected={false} disabled />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('renders correctly when display is not a string', () => {
    renderer.render(<RadioButtonItem display={<Text>GBP</Text>} selected={false} />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
})
