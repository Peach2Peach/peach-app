import { render } from 'test-utils'
import { Language } from './Language'

describe('Language', () => {
  it('renders correctly', () => {
    const { toJSON } = render(<Language />)
    expect(toJSON()).toMatchSnapshot()
  })
})
