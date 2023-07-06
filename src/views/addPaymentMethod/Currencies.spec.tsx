import { Currencies } from './Currencies'
import { createRenderer } from 'react-test-renderer/shallow'

describe('Currencies', () => {
  const renderer = createRenderer()
  const props = {
    currency: 'EUR' as const,
    setCurrency: jest.fn(),
    type: 'europe' as const,
  }

  it('should render correctly for type "eurorpe"', () => {
    renderer.render(<Currencies {...props} />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })

  it('should render correctly for type "other"', () => {
    renderer.render(<Currencies {...props} type="other" />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
})
