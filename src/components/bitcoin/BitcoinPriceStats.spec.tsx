import ShallowRenderer from 'react-test-renderer/shallow'
import { BitcoinPriceStats } from './BitcoinPriceStats'
import { useBitcoinStore } from '../../store/bitcoinStore'
import { mockDimensions } from '../../../tests/unit/helpers/mockDimensions'

describe('BitcoinPriceStats', () => {
  const renderer = ShallowRenderer.createRenderer()

  beforeAll(() => {
    useBitcoinStore.setState({
      currency: 'EUR',
      satsPerUnit: 250,
      price: 400000,
    })
  })
  it('should render correctly', () => {
    mockDimensions({ width: 320, height: 600 })

    renderer.render(<BitcoinPriceStats />)

    const renderOutput = renderer.getRenderOutput()
    expect(renderOutput).toMatchSnapshot()
  })
  it('should render medium screens correctly', () => {
    mockDimensions({ width: 600, height: 840 })

    renderer.render(<BitcoinPriceStats />)

    const renderOutput = renderer.getRenderOutput()
    expect(renderOutput).toMatchSnapshot()
  })
  it('should render correctly when CHF is the currency', () => {
    useBitcoinStore.setState({ currency: 'CHF' })

    renderer.render(<BitcoinPriceStats />)

    const renderOutput = renderer.getRenderOutput()
    expect(renderOutput).toMatchSnapshot()
  })
})
