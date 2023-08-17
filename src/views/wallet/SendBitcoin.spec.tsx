import { fireEvent, render, waitFor } from '@testing-library/react-native'
import { LocalUtxo, OutPoint, TxOut } from 'bdk-rn/lib/classes/Bindings'
import { Script } from 'bdk-rn/lib/classes/Script'
import { KeychainKind } from 'bdk-rn/lib/lib/enums'
import { toMatchDiffSnapshot } from 'snapshot-diff'
import { confirmed1 } from '../../../tests/unit/data/transactionDetailData'
import { NavigationAndQueryClientWrapper } from '../../../tests/unit/helpers/NavigationAndQueryClientWrapper'
import { navigateMock } from '../../../tests/unit/helpers/NavigationWrapper'
import { queryClient } from '../../../tests/unit/helpers/QueryClientWrapper'
import { WithdrawingFundsHelp } from '../../popups/info/WithdrawingFundsHelp'
import { usePopupStore } from '../../store/usePopupStore'
import { getUTXOId } from '../../utils/wallet'
import { PeachWallet } from '../../utils/wallet/PeachWallet'
import { peachWallet, setPeachWallet } from '../../utils/wallet/setWallet'
import { useWalletState } from '../../utils/wallet/walletStore'
import { SendBitcoin } from './SendBitcoin'
expect.extend({ toMatchDiffSnapshot })

jest.useFakeTimers()

const wrapper = NavigationAndQueryClientWrapper
describe('SendBitcoin', () => {
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

describe('SendBitcoin - With selected coins', () => {
  const outpoint = new OutPoint(confirmed1.txid, 0)
  const txOut = new TxOut(10000, new Script('address'))
  const utxo = new LocalUtxo(outpoint, txOut, false, KeychainKind.External)
  const listUnspentMock = jest.fn().mockResolvedValue([utxo])

  beforeAll(() => {
    // @ts-ignore
    setPeachWallet(new PeachWallet())
    // @ts-ignore
    peachWallet.wallet = {
      listUnspent: listUnspentMock,
    }
    useWalletState.setState({ selectedUTXOIds: [getUTXOId(utxo)] })
  })
  it('should render correctly', async () => {
    const { toJSON } = render(<SendBitcoin />, { wrapper })

    await waitFor(() => {
      expect(queryClient.getQueryData(['utxos'])).toStrictEqual([utxo])
    })

    expect(toJSON()).toMatchSnapshot()
  })
  it('should set the amount to the sum of all selected coins when clicking "send max"', async () => {
    const { toJSON, getByText } = render(<SendBitcoin />, { wrapper })

    await waitFor(() => {
      expect(queryClient.getQueryData(['utxos'])).toStrictEqual([utxo])
    })

    const noAmount = toJSON()
    const sendMaxButton = getByText('send max')

    fireEvent.press(sendMaxButton)
    const maxAmount = toJSON()

    expect(noAmount).toMatchDiffSnapshot(maxAmount)
  })
  it('should not allow entering an amount higher than the sum of all selected coins', async () => {
    const { toJSON, getByPlaceholderText } = render(<SendBitcoin />, { wrapper })

    await waitFor(() => {
      expect(queryClient.getQueryData(['utxos'])).toStrictEqual([utxo])
    })

    const amountInput = getByPlaceholderText('000 000 000')
    fireEvent.changeText(amountInput, '123456789')
    expect(render(<SendBitcoin />, { wrapper }).toJSON()).toMatchDiffSnapshot(toJSON())
  })
})
