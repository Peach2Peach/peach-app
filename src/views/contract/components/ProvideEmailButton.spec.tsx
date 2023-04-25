import { ProvideEmailButton } from './ProvideEmailButton'
import { fireEvent, render } from '@testing-library/react-native'
import { defaultOverlay, OverlayContext } from '../../../contexts/overlay'
import { NavigationContext } from '@react-navigation/native'
import { contract } from '../../../../tests/unit/data/contractData'
import DisputeRaisedNotice from '../../../overlays/dispute/components/DisputeRaisedNotice'
import { QueryClientWrapper } from '../../../../tests/unit/helpers/QueryClientWrapper'

let overlay = defaultOverlay
const updateOverlay = jest.fn((newOverlay) => (overlay = newOverlay))

const OverlayWrapper = ({ children }: { children: JSX.Element }) => (
  <OverlayContext.Provider value={[overlay, updateOverlay]}>{children}</OverlayContext.Provider>
)

const NavigationWrapper = ({ children }: { children: JSX.Element }) => (
  <NavigationContext.Provider value={{ replace: jest.fn() }}>{children}</NavigationContext.Provider>
)

describe('ProvideEmailButton', () => {
  const TestWrapper = ({ children }: { children: JSX.Element }) => (
    <QueryClientWrapper>
      <NavigationWrapper>
        <OverlayWrapper>{children}</OverlayWrapper>
      </NavigationWrapper>
    </QueryClientWrapper>
  )

  beforeEach(() => {
    overlay = defaultOverlay
  })

  it('should render correctly', () => {
    const { toJSON } = render(<ProvideEmailButton {...{ contract, view: 'buyer' }} />, { wrapper: TestWrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('should show the dispute raised notice when pressed', () => {
    const { getByText } = render(<ProvideEmailButton {...{ contract, view: 'buyer' }} />, { wrapper: TestWrapper })
    fireEvent.press(getByText('provide email'))
    expect(overlay).toStrictEqual({
      title: 'dispute opened',
      level: 'WARN',
      content: (
        <DisputeRaisedNotice
          submit={expect.any(Function)}
          contract={contract}
          view={'buyer'}
          email={''}
          setEmail={expect.any(Function)}
          emailErrors={['this field is required', 'email is not valid']}
          disputeReason={'other'}
        />
      ),
      visible: true,
      action1: {
        label: 'go to chat',
        icon: 'messageCircle',
        callback: expect.any(Function),
      },
      action2: {
        label: 'close',
        icon: 'xSquare',
        callback: expect.any(Function),
      },
    })
  })
})
