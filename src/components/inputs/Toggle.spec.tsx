import { createRenderer } from 'react-test-renderer/shallow'
import { fireEvent, render } from 'test-utils'
import tw from '../../styles/tailwind'
import { Toggle } from './Toggle'

describe('Toggle', () => {
  const renderer = createRenderer()
  it('renders correctly when not enabled', () => {
    renderer.render(
      <Toggle enabled={false} onPress={jest.fn()}>
        label
      </Toggle>,
    )
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly when enabled', () => {
    renderer.render(
      <Toggle enabled={true} onPress={jest.fn()} style={tw`mt-4`}>
        label
      </Toggle>,
    )
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly when disabled', () => {
    renderer.render(
      <Toggle enabled={false} disabled onPress={jest.fn()} style={tw`mt-4`}>
        label
      </Toggle>,
    )
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })

  it('calls onPress handler', () => {
    const onPress = jest.fn()
    const { getByText } = render(
      <Toggle enabled={true} onPress={onPress}>
        label
      </Toggle>,
    )
    fireEvent.press(getByText('label'))
    expect(onPress).toHaveBeenCalled()
  })
  it('does not call onPress handler when disabled', () => {
    const onPress = jest.fn()
    const { getByText } = render(
      <Toggle enabled={true} disabled onPress={onPress}>
        label
      </Toggle>,
    )
    fireEvent.press(getByText('label'))
    expect(onPress).not.toHaveBeenCalled()
  })
})
