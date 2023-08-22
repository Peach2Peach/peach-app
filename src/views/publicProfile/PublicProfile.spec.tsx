import { render } from '@testing-library/react-native'
import { QueryClientWrapper } from '../../../tests/unit/helpers/QueryClientWrapper'
import { PublicProfile } from './PublicProfile'

jest.useFakeTimers()

describe('PublicProfile', () => {
  it('should render correctly when loading', () => {
    const { toJSON } = render(<PublicProfile />, { wrapper: QueryClientWrapper })
    expect(toJSON()).toMatchSnapshot()
  })
})
