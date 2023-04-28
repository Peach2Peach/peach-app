import { render } from '@testing-library/react-native'
import { NavigationWrapper } from '../../../tests/unit/helpers/NavigationWrapper'
import RestoreBackup from './RestoreBackup'

const useRouteMock = jest.fn(() => ({ params: {} }))
jest.mock('../../hooks/useRoute', () => ({
  useRoute: () => useRouteMock(),
}))

describe('RestoreBackup', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<RestoreBackup />, { wrapper: NavigationWrapper })
    expect(toJSON()).toMatchSnapshot()
  })
})
