import { render } from 'test-utils'
import { headerState, setOptionsMock } from '../../../tests/unit/helpers/NavigationWrapper'
import { RestoreBackupLoading } from './RestoreBackupLoading'

describe('RestoreBackupLoading', () => {
  beforeEach(() => {
    setOptionsMock({ header: { title: '', icons: [] } })
  })
  it('should render correctly', () => {
    const { toJSON } = render(<RestoreBackupLoading />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should set header correctly', () => {
    render(<RestoreBackupLoading />)
    expect(headerState.header()).toMatchSnapshot()
  })
})
