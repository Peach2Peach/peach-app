import ShallowRenderer from 'react-test-renderer/shallow'
import { bitcoinStore } from '../../store/bitcoinStore'
import tw from '../../styles/tailwind'
import { BitcoinPriceStats } from './BitcoinPriceStats'

describe('BitcoinPriceStats', () => {
  const renderer = ShallowRenderer.createRenderer()

  beforeAll(() => {
    bitcoinStore.setState({
      currency: 'EUR',
      satsPerUnit: 250,
      price: 400000,
    })
  })
  it('should render correctly', () => {
    tw.setWindowDimensions({ width: 320, height: 600 })

    renderer.render(<BitcoinPriceStats />)

    const renderOutput = renderer.getRenderOutput()
    expect(renderOutput).toMatchSnapshot()
  })
  it('should render medium screens correctly', () => {
    tw.setWindowDimensions({ width: 600, height: 840 })

    renderer.render(<BitcoinPriceStats />)

    const renderOutput = renderer.getRenderOutput()
    expect(renderOutput).toMatchSnapshot()
  })
})
