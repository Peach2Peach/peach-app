import { fireEvent, render } from '@testing-library/react-native'
import { contract } from '../../../../tests/unit/data/contractData'
import { NavigationWrapper } from '../../../../tests/unit/helpers/NavigationWrapper'
import { QueryClientWrapper } from '../../../../tests/unit/helpers/QueryClientWrapper'
import DisputeRaisedNotice from '../../../overlays/dispute/components/DisputeRaisedNotice'
import { usePopupStore } from '../../../store/usePopupStore'
import { ProvideEmailButton } from './ProvideEmailButton'

describe('ProvideEmailButton', () => {
  const TestWrapper = ({ children }: { children: JSX.Element }) => (
    <QueryClientWrapper>
      <NavigationWrapper>{children}</NavigationWrapper>
    </QueryClientWrapper>
  )

  it('should render correctly', () => {
    const { toJSON } = render(<ProvideEmailButton {...{ contract, view: 'buyer' }} />, { wrapper: TestWrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('should show the dispute raised notice when pressed', () => {
    const { getByText } = render(<ProvideEmailButton {...{ contract, view: 'buyer' }} />, { wrapper: TestWrapper })
    fireEvent.press(getByText('provide email'))
    expect(usePopupStore.getState()).toStrictEqual(
      expect.objectContaining({
        title: 'dispute opened',
        level: 'WARN',
        content: (
          <DisputeRaisedNotice
            contract={contract}
            view={'buyer'}
            email={''}
            setEmail={expect.any(Function)}
            disputeReason={'other'}
            action1={{
              callback: expect.any(Function),
              icon: 'messageCircle',
              label: 'go to chat',
            }}
            action2={{
              callback: expect.any(Function),
              icon: 'xSquare',
              label: 'close',
            }}
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
      }),
    )
  })
})
