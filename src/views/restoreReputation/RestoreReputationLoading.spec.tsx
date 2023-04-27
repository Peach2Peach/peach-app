import { render } from '@testing-library/react-native'
import { useHeaderState } from '../../components/header/store'
import { RestoreReputationLoading } from './RestoreReputationLoading'

describe('RestoreReputationLoading', () => {
  beforeEach(() => {
    useHeaderState.setState({ title: '', icons: [] })
  })
  it('should render correctly', () => {
    const { toJSON } = render(<RestoreReputationLoading />)
    expect(toJSON()).toMatchSnapshot()
  })
})
