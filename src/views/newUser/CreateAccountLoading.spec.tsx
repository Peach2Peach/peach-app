import { render } from 'test-utils'
import { headerState, setOptionsMock } from '../../../tests/unit/helpers/NavigationWrapper'
import { CreateAccountLoading } from './CreateAccountLoading'

describe('CreateAccountLoading', () => {
  beforeEach(() => {
    setOptionsMock({ header: { title: '', icons: [] } })
  })
  it('should render correctly', () => {
    const { toJSON } = render(<CreateAccountLoading />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should set header correctly', () => {
    render(<CreateAccountLoading />)
    expect(headerState.header()).toMatchSnapshot()
  })
})
