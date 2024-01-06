import { createRenderer } from 'react-test-renderer/shallow'
import tw from '../../styles/tailwind'
import { Icon } from '../Icon'
import { TradeInfo } from './TradeInfo'

describe('TradeInfo', () => {
  const renderer = createRenderer()

  it('renders correctly', () => {
    renderer.render(<TradeInfo text={'text'} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })

  it('renders correctly with additional styles', () => {
    renderer.render(<TradeInfo style={tw`mt-4`} text={'text'} textStyle={tw`text-primary-main`} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly with IconComponent', () => {
    renderer.render(<TradeInfo style={tw`mt-4`} text={'text'} IconComponent={<Icon id="activity" />} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
