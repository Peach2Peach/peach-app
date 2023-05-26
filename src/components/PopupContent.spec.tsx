import { PopupContent } from './PopupContent'
import { createRenderer } from 'react-test-renderer/shallow'

describe('PopupContent', () => {
  const renderer = createRenderer()
  const defaultProps = {
    visible: true,
    closePopup: jest.fn(),
  }
  it('should render correctly', () => {
    renderer.render(<PopupContent {...defaultProps} />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
})
