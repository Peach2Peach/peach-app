import { SliderKnob } from './SliderKnob'
import { createRenderer } from 'react-test-renderer/shallow'
import { Animated } from 'react-native'

describe('SliderKnob', () => {
  const renderer = createRenderer()
  it('renders correctly', () => {
    renderer.render(<SliderKnob pan={new Animated.Value(0)} iconId="checkCircle" />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders when disabled', () => {
    renderer.render(<SliderKnob enabled={false} pan={new Animated.Value(0)} iconId="checkCircle" />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders when slided to the end', () => {
    renderer.render(<SliderKnob pan={new Animated.Value(1)} iconId="checkCircle" />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders when slided to 80%', () => {
    renderer.render(<SliderKnob pan={new Animated.Value(0.8)} iconId="checkCircle" />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
