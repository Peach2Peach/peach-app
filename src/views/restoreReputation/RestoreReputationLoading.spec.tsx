import { render } from 'test-utils'
import { headerState, setOptionsMock } from '../../../tests/unit/helpers/NavigationWrapper'
import { RestoreReputationLoading } from './RestoreReputationLoading'

describe('RestoreReputationLoading', () => {
  beforeEach(() => {
    setOptionsMock({ header: { title: '', icons: [] } })
  })
  it('should render correctly', () => {
    const { toJSON } = render(<RestoreReputationLoading />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should set header correctly', () => {
    render(<RestoreReputationLoading />)
    expect(headerState.header()).toMatchSnapshot()
  })
})
