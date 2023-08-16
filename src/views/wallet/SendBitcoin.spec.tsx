import { fireEvent, render } from '@testing-library/react-native'
import { toMatchDiffSnapshot } from 'snapshot-diff'
import { NavigationAndQueryClientWrapper } from '../../../tests/unit/helpers/NavigationAndQueryClientWrapper'
import { WithdrawingFundsHelp } from '../../popups/info/WithdrawingFundsHelp'
import { usePopupStore } from '../../store/usePopupStore'
import { PeachWallet } from '../../utils/wallet/PeachWallet'
import { peachWallet, setPeachWallet } from '../../utils/wallet/setWallet'
import { SendBitcoin } from './SendBitcoin'
expect.extend({ toMatchDiffSnapshot })

jest.useFakeTimers()

describe('SendBitcoin', () => {
  const wrapper = NavigationAndQueryClientWrapper
  beforeAll(() => {
    // @ts-ignore
    setPeachWallet(new PeachWallet())
  })

  it('should render correctly', () => {
    const { toJSON } = render(<SendBitcoin />, { wrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('should update the address on change', () => {
    const { toJSON, getByPlaceholderText } = render(<SendBitcoin />, { wrapper })
    const addressInput = getByPlaceholderText('bc1q ...')
    fireEvent.changeText(addressInput, 'test')
    expect(render(<SendBitcoin />, { wrapper }).toJSON()).toMatchDiffSnapshot(toJSON())
  })
  it('should update the amount on change', () => {
    peachWallet.balance = 21000000
    const { toJSON, getByPlaceholderText } = render(<SendBitcoin />, { wrapper })
    const amountInput = getByPlaceholderText('000 000 000')
    fireEvent.changeText(amountInput, '1234')
    expect(render(<SendBitcoin />, { wrapper }).toJSON()).toMatchDiffSnapshot(toJSON())
  })
  it('should set the amount to the peach wallet balance when clicking "send max"', () => {
    peachWallet.balance = 21000000
    peachWallet.getMaxAvailableAmount = jest.fn().mockReturnValue(21000000)
    const { toJSON, getByText } = render(<SendBitcoin />, { wrapper })
    const sendMaxButton = getByText('send max')
    fireEvent.press(sendMaxButton)
    expect(render(<SendBitcoin />, { wrapper }).toJSON()).toMatchDiffSnapshot(toJSON())
  })
  it('should not allow entering an amount higher than the available balance', () => {
    peachWallet.balance = 21000000
    const { toJSON, getByPlaceholderText } = render(<SendBitcoin />, { wrapper })
    const amountInput = getByPlaceholderText('000 000 000')
    fireEvent.changeText(amountInput, '123456789')
    expect(render(<SendBitcoin />, { wrapper }).toJSON()).toMatchDiffSnapshot(toJSON())
  })
  it('should should the help popup when clicking on the questionmark in the header', () => {
    const { getByAccessibilityHint } = render(<SendBitcoin />, { wrapper })
    const helpButton = getByAccessibilityHint('help')
    fireEvent.press(helpButton)
    expect(usePopupStore.getState()).toStrictEqual(
      expect.objectContaining({
        title: 'sending funds',
        visible: true,
        content: <WithdrawingFundsHelp />,
        action2: {
          callback: expect.any(Function),
          label: 'help',
          icon: 'info',
        },
        level: 'INFO',
      }),
    )
  })
  it.todo('should open the confirmation popup when swiping the slider')
  it.todo('should disable the slider while the form is invalid')
  it.todo('should update the fee rate on change')
  it.todo('should set the fee rate to undefined when selecting "custom"')
  it.todo('should update the custom fee rate on change')
  it('should navigate to "coinSelection" when clicking the list icon in the header', () => {
    const { getByAccessibilityHint } = render(<SendBitcoin />, { wrapper })
    const listButton = getByAccessibilityHint('go to select coins to send')
    fireEvent.press(listButton)
    expect(navigateMock).toHaveBeenCalledWith('coinSelection')
  })
})

describe('SendBitcoin - Selected coins', () => {
  it.todo('should render correctly')
  it.todo('should set the amount to the sum of all selected coins when clicking "send max"')
  it.todo('should not allow entering an amount higher than the sum of all selected coins')
})
