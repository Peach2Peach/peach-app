import { CurrencyTabs } from './CurrencyTabs'
import { createRenderer } from 'react-test-renderer/shallow'

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
