import { fireEvent, render } from 'test-utils'
import { CurrencySelection } from './CurrencySelection'

describe('CurrencySelection', () => {
  const currencies: Currency[] = ['EUR', 'CHF', 'GBP', 'SEK', 'NOK', 'HUF', 'BGN', 'USD', 'RON']

  currencies.forEach((currency, index, self) => {
    it(`renders correctly for ${index + 1} currencies`, () => {
      const { toJSON } = render(
        <CurrencySelection currencies={self.slice(0, index + 1)} selected={currency} select={jest.fn()} />,
      )
      expect(toJSON()).toMatchSnapshot()
    })
  })

  it('can select different currency', () => {
    const select = jest.fn()
    const { getByText } = render(<CurrencySelection currencies={currencies} selected={'EUR'} select={select} />)
    fireEvent(getByText('CHF'), 'onPress')
    expect(select).toHaveBeenCalledWith('CHF')
  })
})
