import { createRenderer } from 'react-test-renderer/shallow'
import { fireEvent, render } from 'test-utils'
import tw from '../../../styles/tailwind'
import { MenuItem } from './MenuItem'

describe('MenuItem', () => {
  const shallowRenderer = createRenderer()
  const onPressMock = jest.fn()
  it('should render correctly', () => {
    shallowRenderer.render(
      <MenuItem onPress={onPressMock} style={tw`mt-2`}>
        test
      </MenuItem>,
    )
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should call function when pressed', () => {
    const { root } = render(<MenuItem onPress={onPressMock}>test</MenuItem>)
    fireEvent(root, 'onPress')
    expect(onPressMock).toHaveBeenCalled()
  })
})
