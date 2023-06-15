import { createRenderer } from 'react-test-renderer/shallow'
import { TradeInfo } from './TradeInfo'
import tw from '../../styles/tailwind'

describe('TradeInfo', () => {
  const renderer = createRenderer()

  it('renders correctly', () => {
    renderer.render(<TradeInfo text={'text'} iconId="alertCircle" />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })

  it('renders correctly with additional styles', () => {
    renderer.render(
      <TradeInfo
        style={tw`mt-4`}
        text={'text'}
        textStyle={tw`text-primary-main`}
        iconId="alertCircle"
        iconSize={20}
        iconColor={'#BADA55'}
      />,
    )
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
