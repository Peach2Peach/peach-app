import { render } from 'test-utils'
import { Report } from './Report'

jest.mock('../../hooks/useRoute', () => ({
  useRoute: jest.fn(() => ({
    params: {
      reason: 'other',
      topic: 'topic',
      message: 'message',
      shareDeviceID: true,
    },
  })),
}))

describe('Report', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<Report />)
    expect(toJSON()).toMatchSnapshot()
  })
})
