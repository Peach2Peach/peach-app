import { render } from 'test-utils'
import { GroupHugAnnouncement } from './GroupHugAnnouncement'

jest.mock('../../hooks/useRoute', () => ({
  useRoute: jest.fn(() => ({
    params: {
      offerId: '1234',
    },
  })),
}))

describe('GroupHugAnnouncement', () => {
  it('renders correctly', () => {
    const { toJSON } = render(<GroupHugAnnouncement />)
    expect(toJSON()).toMatchSnapshot()
  })
})
