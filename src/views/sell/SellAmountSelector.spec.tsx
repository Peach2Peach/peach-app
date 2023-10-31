import { createRenderer } from 'react-test-renderer/shallow'
import { Text } from '../../components'
import { SellAmountSelector } from './SellAmountSelector'

describe('SellAmountSelector', () => {
  it('should render correctly', () => {
    const renderer = createRenderer()
    renderer.render(<SellAmountSelector />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render children', () => {
    const renderer = createRenderer()
    renderer.render(
      <SellAmountSelector>
        <Text>I'm a child</Text>
      </SellAmountSelector>,
    )
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
