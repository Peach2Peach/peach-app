import { render } from 'test-utils'
import { InfoFrame } from './InfoFrame'

describe('InfoFrame', () => {
  it('renders correctly', () => {
    const { toJSON } = render(<InfoFrame text="test text" />)
    expect(toJSON()).toMatchSnapshot()
  })
})
