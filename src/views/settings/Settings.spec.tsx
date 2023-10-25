import { render } from 'test-utils'
import { Settings } from './Settings'

jest.mock('../../hooks/useRoute', () => ({
  useRoute: () => ({
    name: 'settings',
  }),
}))

describe('Settings', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<Settings />)
    expect(toJSON()).toMatchSnapshot()
  })
})
