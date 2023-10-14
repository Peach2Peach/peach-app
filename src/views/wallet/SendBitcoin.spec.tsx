import { Wallet } from 'bdk-rn'
import { LocalUtxo, OutPoint, TxOut } from 'bdk-rn/lib/classes/Bindings'
import { Script } from 'bdk-rn/lib/classes/Script'
import { KeychainKind } from 'bdk-rn/lib/lib/enums'
import { toMatchDiffSnapshot } from 'snapshot-diff'
import { act, fireEvent, render, waitFor } from 'test-utils'
import { account1 } from '../../../tests/unit/data/accountData'
import { confirmed1 } from '../../../tests/unit/data/transactionDetailData'
import { NavigationAndQueryClientWrapper } from '../../../tests/unit/helpers/CustomWrapper'
import { navigateMock } from '../../../tests/unit/helpers/NavigationWrapper'
import { queryClient } from '../../../tests/unit/helpers/QueryClientWrapper'
import { swipeRight } from '../../../tests/unit/helpers/fireSwipeEvent'
import { walletListUnspentMock } from '../../../tests/unit/mocks/bdkRN'
import { WithdrawalConfirmation } from '../../popups/WithdrawalConfirmation'
import { defaultPopupState, usePopupStore } from '../../store/usePopupStore'
import { createWalletFromBase58, getNetwork, getUTXOId } from '../../utils/wallet'
import { PeachWallet } from '../../utils/wallet/PeachWallet'
import { peachWallet, setPeachWallet } from '../../utils/wallet/setWallet'
import { defaultWalletState, useWalletState } from '../../utils/wallet/walletStore'
import { SendBitcoin } from './SendBitcoin'
expect.extend({ toMatchDiffSnapshot })

jest.useFakeTimers()

const wrapper = NavigationAndQueryClientWrapper
describe('SendBitcoin', () => {
  beforeAll(() => {
    const wallet = createWalletFromBase58(account1.base58, getNetwork())
    setPeachWallet(new PeachWallet({ wallet }))
  })

  beforeEach(() => {
    usePopupStore.setState(defaultPopupState)
    useWalletState.setState(defaultWalletState)
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
    const { toJSON, getByTestId } = render(<SendBitcoin />, { wrapper })
    const amountInput = getByTestId('btc-amount-input')
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
    const { toJSON, getByTestId } = render(<SendBitcoin />, { wrapper })
    const amountInput = getByTestId('btc-amount-input')
    fireEvent.changeText(amountInput, '123456789')
    expect(render(<SendBitcoin />, { wrapper }).toJSON()).toMatchDiffSnapshot(toJSON())
  })
  it('should update the fee rate on change', () => {
    const { toJSON, getByText } = render(<SendBitcoin />, { wrapper })
    const mediumFeeButton = getByText('~ 30 minutes  (1 sat/vB)')
    fireEvent.press(mediumFeeButton)
    expect(render(<SendBitcoin />, { wrapper }).toJSON()).toMatchDiffSnapshot(toJSON())
  })
  it('should should the help popup when clicking on the questionmark in the header', () => {
    const { getByAccessibilityHint } = render(<SendBitcoin />, { wrapper })
    const helpButton = getByAccessibilityHint('help')
    fireEvent.press(helpButton)
    const popupComponent = usePopupStore.getState().popupComponent || <></>
    expect(render(popupComponent, { wrapper }).toJSON()).toMatchSnapshot()
  })
  it('should disable the slider while the wallet is not synced', () => {
    useWalletState.setState({ isSynced: false })
    const { getByTestId, getByText, getByPlaceholderText, toJSON } = render(<SendBitcoin />, { wrapper })

    const addressInput = getByPlaceholderText('bc1q ...')
    fireEvent.changeText(addressInput, 'bcrt1qm50khyunelhjzhckvgy3qj0hn7xjzzwljhfgd0')
    const amountInput = getByTestId('btc-amount-input')
    fireEvent.changeText(amountInput, '1234')
    const mediumFeeButton = getByText('~ 30 minutes  (1 sat/vB)')
    fireEvent.press(mediumFeeButton)

    const withSyncingWallet = toJSON()
    act(() => {
      useWalletState.setState({ isSynced: true })
    })
    const withSyncedWallet = toJSON()

    expect(withSyncedWallet).toMatchDiffSnapshot(withSyncingWallet)
  })

  it('should open the confirmation popup when swiping the slider', async () => {
    useWalletState.setState({ isSynced: true })
    const { getByTestId, getByText, getByPlaceholderText } = render(<SendBitcoin />, { wrapper })

    const addressInput = getByPlaceholderText('bc1q ...')
    fireEvent.changeText(addressInput, 'bcrt1qm50khyunelhjzhckvgy3qj0hn7xjzzwljhfgd0')
    const amountInput = getByTestId('btc-amount-input')
    fireEvent.changeText(amountInput, '1234')
    const mediumFeeButton = getByText('~ 30 minutes  (1 sat/vB)')
    fireEvent.press(mediumFeeButton)

    const slider = getByTestId('confirmSlider')
    peachWallet.buildFinishedTransaction = jest.fn().mockResolvedValue({ psbt: { feeAmount: () => 1000 } })
    swipeRight(slider)

    await waitFor(() => {
      expect(usePopupStore.getState()).toStrictEqual(
        expect.objectContaining({
          visible: true,
          title: 'sending funds',
          content: (
            <WithdrawalConfirmation
              feeRate={1}
              address="bcrt1qm50khyunelhjzhckvgy3qj0hn7xjzzwljhfgd0"
              amount={1234}
              fee={1000}
              {...{ shouldDrainWallet: false, utxos: [] }}
            />
          ),
          action1: {
            callback: expect.any(Function),
            label: 'confirm & send',
            icon: 'arrowRightCircle',
          },
          action2: {
            callback: expect.any(Function),
            label: 'cancel',
            icon: 'xCircle',
          },
          level: 'APP',
        }),
      )
    })
  })
  it('should disable the slider while the form is invalid', () => {
    const { getByTestId } = render(<SendBitcoin />, { wrapper })
    const slider = getByTestId('confirmSlider')
    swipeRight(slider)
    expect(usePopupStore.getState().visible).toBe(false)
  })
  it('should set the fee rate to undefined when selecting "custom"', () => {
    const { getByText, getByPlaceholderText, getByTestId } = render(<SendBitcoin />, { wrapper })
    const addressInput = getByPlaceholderText('bc1q ...')
    fireEvent.changeText(addressInput, 'bcrt1qm50khyunelhjzhckvgy3qj0hn7xjzzwljhfgd0')
    const amountInput = getByTestId('btc-amount-input')
    fireEvent.changeText(amountInput, '1234')
    const customFeeButton = getByText('custom: ')
    fireEvent.press(customFeeButton)

    swipeRight(getByTestId('confirmSlider'))
    expect(usePopupStore.getState().visible).toBe(false)
  })
  it('should update the custom fee rate on change', async () => {
    useWalletState.setState({ isSynced: true })
    const { getByText, getByPlaceholderText, getByTestId } = render(<SendBitcoin />, { wrapper })
    const addressInput = getByPlaceholderText('bc1q ...')
    fireEvent.changeText(addressInput, 'bcrt1qm50khyunelhjzhckvgy3qj0hn7xjzzwljhfgd0')
    const amountInput = getByTestId('btc-amount-input')
    fireEvent.changeText(amountInput, '1234')
    const customFeeButton = getByText('custom: ')
    fireEvent.press(customFeeButton)

    const customFeeInput = getByTestId('input-custom-fees')
    fireEvent.changeText(customFeeInput, '4')

    swipeRight(getByTestId('confirmSlider'))

    await waitFor(() => {
      expect(usePopupStore.getState()).toStrictEqual(
        expect.objectContaining({
          visible: true,
          title: 'sending funds',
          content: (
            <WithdrawalConfirmation
              feeRate={4}
              address="bcrt1qm50khyunelhjzhckvgy3qj0hn7xjzzwljhfgd0"
              amount={1234}
              fee={1000}
              {...{ shouldDrainWallet: false, utxos: [] }}
            />
          ),
          action1: {
            callback: expect.any(Function),
            label: 'confirm & send',
            icon: 'arrowRightCircle',
          },
          action2: {
            callback: expect.any(Function),
            label: 'cancel',
            icon: 'xCircle',
          },
          level: 'APP',
        }),
      )
    })
  })
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

  beforeAll(() => {
    const wallet = createWalletFromBase58(account1.base58, getNetwork())
    setPeachWallet(new PeachWallet({ wallet }))
    peachWallet.wallet = new Wallet()
    walletListUnspentMock.mockResolvedValue([utxo])
  })

  beforeEach(() => {
    useWalletState.setState({ selectedUTXOIds: [getUTXOId(utxo)], addressLabelMap: { address: 'addressLabel' } })
  })
  it('should render correctly', async () => {
    const { toJSON } = render(<SendBitcoin />, { wrapper })

    await waitFor(() => {
      expect(queryClient.getQueryData(['utxos'])).toStrictEqual([utxo])
      expect(queryClient.getQueryData(['address', utxo.txout.script.id])).toBe('address')
    })
    const withSelectedCoins = toJSON()

    act(() => {
      useWalletState.setState({ selectedUTXOIds: [] })
    })
    const withoutSelectedCoins = render(<SendBitcoin />, { wrapper }).toJSON()

    expect(withoutSelectedCoins).toMatchDiffSnapshot(withSelectedCoins)
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
    const { toJSON, getByTestId } = render(<SendBitcoin />, { wrapper })

    await waitFor(() => {
      expect(queryClient.getQueryData(['utxos'])).toStrictEqual([utxo])
    })

    const amountInput = getByTestId('btc-amount-input')
    fireEvent.changeText(amountInput, '123456789')
    expect(render(<SendBitcoin />, { wrapper }).toJSON()).toMatchDiffSnapshot(toJSON())
  })
})
