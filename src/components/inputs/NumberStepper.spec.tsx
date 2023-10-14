import { createRenderer } from 'react-test-renderer/shallow'
import { fireEvent, render } from 'test-utils'
import tw from '../../styles/tailwind'
import { NumberStepper } from './NumberStepper'

describe('NumberStepper', () => {
  const renderer = createRenderer()
  it('renders correctly', () => {
    renderer.render(<NumberStepper value={4} onChange={jest.fn()} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly with style', () => {
    renderer.render(<NumberStepper value={4} onChange={jest.fn()} style={tw`mt-4`} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly when minimum is reached', () => {
    renderer.render(<NumberStepper value={4} min={4} onChange={jest.fn()} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly when maximum is reached', () => {
    renderer.render(<NumberStepper value={4} max={4} onChange={jest.fn()} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('allows increasing and decreasing number', () => {
    const onChange = jest.fn()
    const { getByAccessibilityHint } = render(<NumberStepper value={4} onChange={onChange} />)
    fireEvent.press(getByAccessibilityHint('decrease number'))
    expect(onChange).toHaveBeenCalledWith(3)
    fireEvent.press(getByAccessibilityHint('increase number'))
    expect(onChange).toHaveBeenCalledWith(5)
  })
  it('prevents increasing and decreasing number when min/max are reached', () => {
    const onChange = jest.fn()
    const { getByAccessibilityHint } = render(<NumberStepper value={4} min={4} max={4} onChange={onChange} />)
    fireEvent.press(getByAccessibilityHint('decrease number'))
    expect(onChange).not.toHaveBeenCalled()
    fireEvent.press(getByAccessibilityHint('increase number'))
    expect(onChange).not.toHaveBeenCalled()
  })
})
