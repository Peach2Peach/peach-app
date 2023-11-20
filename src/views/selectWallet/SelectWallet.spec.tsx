import { render } from 'test-utils'
import { SelectWallet } from './SelectWallet'

jest.mock('../../hooks/useRoute', () => ({
  useRoute: jest.fn(() => ({
    params: {
      type: 'payout',
    },
  })),
}))

describe('SelectWallet', () => {
  it('renders correctly', () => {
    const { toJSON } = render(<SelectWallet />)

    expect(toJSON()).toMatchSnapshot()
  })
})
