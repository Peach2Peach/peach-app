import { Other } from './Other'
import { createRenderer } from 'react-test-renderer/shallow'

describe('Other', () => {
  const renderer = createRenderer()
  const props = {
    currency: 'EUR' as const,
    setCurrency: jest.fn(),
  }

  it('should render correctly', () => {
    renderer.render(<Other {...props} />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
})
