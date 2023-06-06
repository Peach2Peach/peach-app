import { CurrencySelection } from './CurrencySelection'
import { createRenderer } from 'react-test-renderer/shallow'
import { setPaymentMethods } from '../../../../../constants'
import { fireEvent, render } from '@testing-library/react-native'

describe('CurrencySelection', () => {
  const renderer = createRenderer()
  const onToggle = jest.fn()

  setPaymentMethods([
    {
      id: 'revolut',
      currencies: ['EUR', 'CHF', 'GBP', 'BGN', 'CZK', 'DKK', 'HUF', 'ISK', 'NOK', 'PLN', 'RON', 'SEK'],
      anonymous: false,
    },
  ])
  it('should render correctly', () => {
    renderer.render(
      <CurrencySelection paymentMethod="revolut" selectedCurrencies={['EUR', 'CHF']} onToggle={onToggle} />,
    )
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('should toggle a selection correctly', () => {
    const { getByText } = render(
      <CurrencySelection paymentMethod="revolut" selectedCurrencies={['EUR', 'CHF']} onToggle={onToggle} />,
    )
    fireEvent(getByText('GBP'), 'onPress')
    expect(onToggle).toHaveBeenCalledWith('GBP')
  })
})
