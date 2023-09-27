import { createRenderer } from 'react-test-renderer/shallow'
import { MissingPermissionsPopup } from './MissingPermissionsPopup'

describe('MissingPermissionsPopup', () => {
  const renderer = createRenderer()
  it('should render correctly', () => {
    renderer.render(<MissingPermissionsPopup />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
