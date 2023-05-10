import ShallowRenderer from 'react-test-renderer/shallow'
import { Label } from './Label'
import { Text } from '.'

describe('Label', () => {
  const renderer = ShallowRenderer.createRenderer()
  it('renders correctly', () => {
    renderer.render(
      <Label onPress={jest.fn()}>
        <Text>Test</Text>
      </Label>,
    )
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
