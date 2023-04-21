import { MatchCardCounterparty } from './MatchCardCounterparty'
import { createRenderer } from 'react-test-renderer/shallow'
import { NavigationContext } from '@react-navigation/native'

const pushMock = jest.fn()
const navigationWrapper: React.ComponentType<any> | undefined = ({ children }: any) => (
  // @ts-ignore
  <NavigationContext.Provider value={{ push: pushMock }}>{children}</NavigationContext.Provider>
)

describe('MatchCardCounterparty', () => {
  it('renders correctly', () => {
    const renderer = createRenderer()

    renderer.render(<MatchCardCounterparty user={{ id: '123', rating: 1, trades: 21 } as User} />, {
      wrapper: navigationWrapper,
    })
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
