import { render } from '@testing-library/react-native'
import { NavigationWrapper } from '../../../../tests/unit/helpers/NavigationWrapper'
import { QueryClientWrapper } from '../../../../tests/unit/helpers/QueryClientWrapper'
import { useHeaderState } from '../../../components/header/store'
import MyProfile from './MyProfile'

const wrapper = ({ children }: ComponentProps) => (
  <NavigationWrapper>
    <QueryClientWrapper>{children}</QueryClientWrapper>
  </NavigationWrapper>
)

describe('MyProfile', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should set up header correctly', () => {
    render(<MyProfile />, { wrapper })
    expect(useHeaderState.getState().title).toBe('my profile')
    expect(useHeaderState.getState().icons?.[0].id).toBe('helpCircle')
  })
})
