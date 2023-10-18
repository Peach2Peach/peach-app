import { render } from 'test-utils'
import { RestoreBackup } from './RestoreBackup'

const useRouteMock = jest.fn(() => ({ params: {} }))
jest.mock('../../hooks/useRoute', () => ({
  useRoute: () => useRouteMock(),
}))

describe('RestoreBackup', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<RestoreBackup />)
    expect(toJSON()).toMatchSnapshot()
  })
})
