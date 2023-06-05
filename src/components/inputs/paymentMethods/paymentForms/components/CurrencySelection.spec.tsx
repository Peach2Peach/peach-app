import { createRenderer } from 'react-test-renderer/shallow'
import { CurrencySelection } from './CurrencySelection'
import { setPaymentMethods } from '../../../../../constants'

describe('CurrencySelection', () => {
  const onToggle = jest.fn()
  const renderer = createRenderer()
  it('renders correctly', () => {
    setPaymentMethods([
      {
        id: 'revolut',
        currencies: ['EUR', 'CHF', 'GBP', 'BGN', 'CZK', 'DKK', 'HUF', 'ISK', 'NOK', 'PLN', 'RON', 'SEK'],
        anonymous: false,
      },
    ])
    renderer.render(
      <CurrencySelection paymentMethod="revolut" selectedCurrencies={['EUR', 'CHF']} onToggle={onToggle} />,
    )
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
