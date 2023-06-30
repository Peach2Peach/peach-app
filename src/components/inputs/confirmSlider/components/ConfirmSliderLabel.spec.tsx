import { ConfirmSliderLabel } from './ConfirmSliderLabel'
import { createRenderer } from 'react-test-renderer/shallow'

describe('ConfirmSliderLabel', () => {
  const renderer = createRenderer()
  it('renders correctly', () => {
    renderer.render(<ConfirmSliderLabel>label</ConfirmSliderLabel>)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
