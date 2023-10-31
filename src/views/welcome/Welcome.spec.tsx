import { render } from 'test-utils'
import { headerState, setOptionsMock } from '../../../tests/unit/helpers/NavigationWrapper'
import { useSettingsStore } from '../../store/settingsStore'
import { Welcome } from './Welcome'

describe('Welcome', () => {
  beforeEach(() => {
    setOptionsMock({ header: { title: '', icons: [] } })
  })
  it('should render correctly', () => {
    useSettingsStore.getState().setUsedReferralCode(true)

    const { toJSON } = render(<Welcome />)
    expect(toJSON()).toMatchSnapshot()
  })

  it('should set header correctly', () => {
    render(<Welcome />)
    expect(headerState.header()).toMatchSnapshot()
  })
})
