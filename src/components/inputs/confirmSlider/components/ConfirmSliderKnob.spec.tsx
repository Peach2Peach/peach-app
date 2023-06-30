import { ConfirmSliderKnob } from './ConfirmSliderKnob'
import { createRenderer } from 'react-test-renderer/shallow'
import { Animated } from 'react-native'

describe('ConfirmSliderKnob', () => {
  const renderer = createRenderer()
  it('renders correctly', () => {
    renderer.render(<ConfirmSliderKnob pan={new Animated.Value(0)} iconId="checkCircle" knobWidth={40} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders when disabled', () => {
    renderer.render(<ConfirmSliderKnob disabled pan={new Animated.Value(0)} iconId="checkCircle" knobWidth={40} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders when slided to the end', () => {
    renderer.render(<ConfirmSliderKnob pan={new Animated.Value(1)} iconId="checkCircle" knobWidth={40} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders when slided to 80%', () => {
    renderer.render(<ConfirmSliderKnob pan={new Animated.Value(0.8)} iconId="checkCircle" knobWidth={40} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
