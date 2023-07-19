import { createRenderer } from 'react-test-renderer/shallow'
import { Popup } from './Popup'
import { usePopupStore } from '../store/usePopupStore'

describe('Popup', () => {
  const renderer = createRenderer()
  const defaultProps = {
    visible: true,
    closePopup: jest.fn(),
  }
  beforeAll(() => {
    usePopupStore.setState({ ...defaultProps })
  })
  it('should render correctly', () => {
    renderer.render(<Popup />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
})
