import ShallowRenderer from 'react-test-renderer/shallow'
import { ConfirmationTime } from './ConfirmationTime'

describe('ConfirmationTime', () => {
  const renderer = ShallowRenderer.createRenderer()
  it('renders correctly', () => {
    renderer.render(<ConfirmationTime />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
