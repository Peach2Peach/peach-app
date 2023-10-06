import ShallowRenderer from 'react-test-renderer/shallow'
import { mockDimensions } from '../../../tests/unit/helpers/mockDimensions'
import { useBitcoinStore } from '../../store/bitcoinStore'
import { Tickers } from './Tickers'

describe('Tickers', () => {
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

    renderer.render(<Tickers />)

    const renderOutput = renderer.getRenderOutput()
    expect(renderOutput).toMatchSnapshot()
  })
  it('should render medium screens correctly', () => {
    mockDimensions({ width: 600, height: 840 })

    renderer.render(<Tickers />)

    const renderOutput = renderer.getRenderOutput()
    expect(renderOutput).toMatchSnapshot()
  })
  it('should render correctly if the currency is CHF', () => {
    useBitcoinStore.setState({ currency: 'CHF' })

    renderer.render(<Tickers />)

    const renderOutput = renderer.getRenderOutput()
    expect(renderOutput).toMatchSnapshot()
  })
})
