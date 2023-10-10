import { createRenderer } from 'react-test-renderer/shallow'
import { mockDimensions } from '../../../tests/unit/helpers/mockDimensions'
import { Text } from '../text'
import { SummaryItem } from './SummaryItem'

describe('SummaryItem', () => {
  const renderer = createRenderer()
  it('renders correctly', () => {
    renderer.render(
      <SummaryItem title="rating">
        <Text>children</Text>
      </SummaryItem>,
    )
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly for medium screens', () => {
    mockDimensions({ width: 600, height: 840 })

    renderer.render(
      <SummaryItem title="rating">
        <Text>children</Text>
      </SummaryItem>,
    )
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
