import { ConfirmSlider } from './ConfirmSlider'
import { createRenderer } from 'react-test-renderer/shallow'

describe('ConfirmSlider', () => {
  const renderer = createRenderer()
  it('renders correctly', () => {
    renderer.render(<ConfirmSlider label1="label1" label2="label2" onUnlock={() => {}} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders with different icon', () => {
    renderer.render(<ConfirmSlider label1="label1" label2="label2" onUnlock={() => {}} iconId="award" />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly when disabled', () => {
    renderer.render(<ConfirmSlider label1="label1" label2="label2" onUnlock={() => {}} disabled />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
