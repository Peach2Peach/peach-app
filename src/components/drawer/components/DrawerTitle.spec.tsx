import { render } from 'test-utils'
import { useDrawerState } from '../useDrawerState'
import { DrawerTitle } from './DrawerTitle'

describe('DrawerTitle', () => {
  it('renders correctly', () => {
    useDrawerState.setState({ title: 'testTitle' })
    const { toJSON } = render(<DrawerTitle />)
    expect(toJSON()).toMatchSnapshot()
  })
})
