import { render } from 'test-utils'
import { RestoreFromSeed } from './RestoreFromSeed'

describe('RestoreFromSeed', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<RestoreFromSeed />)
    expect(toJSON()).toMatchSnapshot()
  })
})
