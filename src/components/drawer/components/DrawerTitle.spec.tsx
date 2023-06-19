import { DrawerTitle } from './DrawerTitle'
import { render } from '@testing-library/react-native'
import { defaultState, DrawerContext } from '../../../contexts/drawer'

describe('DrawerTitle', () => {
  const wrapper = ({ children }: { children: JSX.Element }) => (
    <DrawerContext.Provider value={[{ ...defaultState, title: 'testTitle' }, () => {}]}>
      {children}
    </DrawerContext.Provider>
  )
  it('renders correctly', () => {
    const { toJSON } = render(<DrawerTitle />, { wrapper })
    expect(toJSON()).toMatchSnapshot()
  })
})
