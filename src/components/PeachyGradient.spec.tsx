import { render } from 'test-utils'
import { PeachyGradient } from './PeachyGradient'

describe('PeachyGradient', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<PeachyGradient />)
    expect(toJSON()).toMatchSnapshot()
  })
})
