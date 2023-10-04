import { createRenderer } from 'react-test-renderer/shallow'
import { CurrencyTabs } from './CurrencyTabs'

describe('CurrencyTabs', () => {
  const renderer = createRenderer()
  const props = {
    currency: 'EUR' as const,
    setCurrency: jest.fn(),
  }

  it('should render correctly', () => {
    renderer.render(<CurrencyTabs {...props} />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
})
