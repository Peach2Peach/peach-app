import ShallowRenderer from 'react-test-renderer/shallow'
import { SendTo } from './SendTo'
import { fireEvent, render } from '@testing-library/react-native'

describe('SendTo', () => {
  const renderer = ShallowRenderer.createRenderer()
  const address = 'address'
  const setAddress = jest.fn()
  it('renders correctly', () => {
    renderer.render(<SendTo {...{ address, setAddress }} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should set address', () => {
    const newAddress = 'newAddress'
    const { getByPlaceholderText } = render(<SendTo {...{ address, setAddress }} />)
    fireEvent(getByPlaceholderText('bc1q ...'), 'onChange', newAddress)
    expect(setAddress).toHaveBeenCalledWith(newAddress)
  })
})
