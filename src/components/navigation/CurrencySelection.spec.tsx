import { createRenderer } from 'react-test-renderer/shallow'
import { CurrencySelection } from './CurrencySelection'

describe('CurrencySelection', () => {
  const renderer = createRenderer()
  const currencies: Currency[] = ['EUR', 'CHF', 'GBP', 'SEK', 'NOK', 'HUF', 'BGN', 'USD', 'RON']

  currencies.forEach((currency, index, self) => {
    it(`renders correctly for ${index} currencies`, () => {
      renderer.render(<CurrencySelection currencies={self.slice(0, index)} selected={currency} select={() => {}} />)
      expect(renderer.getRenderOutput()).toMatchSnapshot()
    })
  })
})
