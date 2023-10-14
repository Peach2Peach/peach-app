import { render } from 'test-utils'
import { UserExistsForDevice } from './UserExistsForDevice'

const useRouteMock = jest.fn().mockReturnValue({
  params: {},
})
jest.mock('../../hooks/useRoute', () => ({
  useRoute: () => useRouteMock(),
}))

describe('UserExistsForDevice', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<UserExistsForDevice />)
    expect(toJSON()).toMatchSnapshot()
  })
})
