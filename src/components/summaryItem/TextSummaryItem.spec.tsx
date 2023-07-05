import { createRenderer } from 'react-test-renderer/shallow'
import { TextSummaryItem } from './TextSummaryItem'
import { fireEvent, render } from '@testing-library/react-native'

describe('TextSummaryItem', () => {
  const renderer = createRenderer()
  const onPress = jest.fn()

  it('renders correctly', () => {
    renderer.render(<TextSummaryItem title="rating" text="text" />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly with icon', () => {
    renderer.render(<TextSummaryItem title="rating" text="text" iconId="checkCircle" iconColor={'#BADA55'} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly with action', () => {
    renderer.render(
      <TextSummaryItem title="rating" text="text" iconId="checkCircle" iconColor={'#BADA55'} onPress={onPress} />,
    )
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('action is triggered when pressed', () => {
    const { getByText } = render(
      <TextSummaryItem title="rating" text="text" iconId="checkCircle" iconColor={'#BADA55'} onPress={onPress} />,
    )
    fireEvent.press(getByText('text'))
    expect(onPress).toHaveBeenCalled()
  })
})
