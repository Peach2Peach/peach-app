import { createRenderer } from 'react-test-renderer/shallow'
import { TradeInfo } from './TradeInfo'

describe('TradeInfo', () => {
  const renderer = createRenderer()

  it('renders correctly', () => {
    renderer.render(<TradeInfo text={'text'} iconId="alertCircle" />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly with icon color', () => {
    renderer.render(<TradeInfo text={'text'} iconId="alertCircle" iconColor={'#BADA55'} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
