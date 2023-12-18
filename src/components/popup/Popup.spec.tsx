import { Text } from 'react-native'
import { createRenderer } from 'react-test-renderer/shallow'
import { usePopupStore } from '../../store/usePopupStore'
import { Popup } from './Popup'

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
  it('should render the popup component if it exists', () => {
    usePopupStore.setState({ popupComponent: <Text>Popup Component</Text> })
    renderer.render(<Popup />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
})
