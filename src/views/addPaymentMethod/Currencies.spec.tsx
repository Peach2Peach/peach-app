import { Currencies } from './Currencies'
import { createRenderer } from 'react-test-renderer/shallow'

describe('Currencies', () => {
  const renderer = createRenderer()
  const props = {
    currency: 'EUR' as const,
    setCurrency: jest.fn(),
  }

  it('should render correctly', () => {
    renderer.render(<Currencies {...props} />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
})
