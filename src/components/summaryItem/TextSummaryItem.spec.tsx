import { createRenderer } from 'react-test-renderer/shallow'
import { TextSummaryItem } from './TextSummaryItem'

describe('TextSummaryItem', () => {
  const renderer = createRenderer()
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
      <TextSummaryItem title="rating" text="text" iconId="checkCircle" iconColor={'#BADA55'} onPress={jest.fn()} />,
    )
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
