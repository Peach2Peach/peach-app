import { LocalUtxo, OutPoint, TxOut } from 'bdk-rn/lib/classes/Bindings'
import { Script } from 'bdk-rn/lib/classes/Script'
import { KeychainKind } from 'bdk-rn/lib/lib/enums'
import { toMatchDiffSnapshot } from 'snapshot-diff'
import { fireEvent, render, waitFor } from 'test-utils'
import { confirmed1 } from '../../../tests/unit/data/transactionDetailData'
import { navigateMock } from '../../../tests/unit/helpers/NavigationWrapper'
import { queryClient } from '../../../tests/unit/helpers/QueryClientWrapper'
import { usePopupStore } from '../../store/usePopupStore'
import { getUTXOId } from '../../utils/wallet'
import { PeachWallet } from '../../utils/wallet/PeachWallet'
import { peachWallet, setPeachWallet } from '../../utils/wallet/setWallet'
import { useWalletState } from '../../utils/wallet/walletStore'
import { CoinSelection } from './CoinSelection'
expect.extend({ toMatchDiffSnapshot })

jest.useFakeTimers()

describe('CoinSelection', () => {
  const outpoint = new OutPoint(confirmed1.txid, 0)
  const script = new Script('address')
  const amount = 10000
  const txOut = new TxOut(amount, script)
  const utxo = new LocalUtxo(outpoint, txOut, false, KeychainKind.External)
  const listUnspentMock = jest.fn().mockResolvedValue([utxo])

  beforeAll(() => {
    // @ts-expect-error mock doesn't need args
    setPeachWallet(new PeachWallet())
    // @ts-expect-error mock doesn't all methods
    peachWallet.wallet = {
      listUnspent: listUnspentMock,
    }
  })
  beforeEach(() => {
    queryClient.clear()
    useWalletState.setState({
      selectedUTXOIds: [],
      addressLabelMap: {
        [script.id]: 'addressLabel',
      },
    })
  })

  it('should open the help popup when the help icon is pressed', async () => {
    const { getByAccessibilityHint } = render(<CoinSelection />)

    await waitFor(() => {
      expect(queryClient.getQueryData(['utxos'])).toStrictEqual([utxo])
    })
    const helpIcon = getByAccessibilityHint('help')

    fireEvent.press(helpIcon)
    const popupComponent = usePopupStore.getState().popupComponent ?? <></>
    expect(render(popupComponent).toJSON()).toMatchSnapshot()
  })
  it('renders correctly while loading', () => {
    const { toJSON } = render(<CoinSelection />)

    expect(toJSON()).toMatchSnapshot()
  })
  it('renders correctly', async () => {
    const { toJSON } = render(<CoinSelection />)

    await waitFor(() => {
      expect(queryClient.getQueryData(['utxos'])).toStrictEqual([utxo])
      expect(queryClient.getQueryData(['address', script.id])).toStrictEqual('address')
    })

    expect(toJSON()).toMatchSnapshot()
  })
  it('selects coins', async () => {
    const { toJSON, getByTestId } = render(<CoinSelection />)

    await waitFor(() => {
      expect(queryClient.getQueryData(['utxos'])).toStrictEqual([utxo])
      expect(queryClient.getQueryData(['address', script.id])).toStrictEqual('address')
    })

    const withoutSelection = toJSON()

    const checkbox = getByTestId('checkbox')
    fireEvent.press(checkbox)

    const withSelection = toJSON()
    expect(withoutSelection).toMatchDiffSnapshot(withSelection)
  })
  it('saves selection and navigates to "sendBitcoin" when "confirm" is pressed', async () => {
    const { getByText, getByTestId } = render(<CoinSelection />)

    await waitFor(() => {
      expect(queryClient.getQueryData(['utxos'])).toStrictEqual([utxo])
      expect(queryClient.getQueryData(['address', script.id])).toStrictEqual('address')
    })

    const checkbox = getByTestId('checkbox')
    fireEvent.press(checkbox)

    const confirmButton = getByText('confirm')
    fireEvent.press(confirmButton)

    expect(useWalletState.getState()).toStrictEqual(
      expect.objectContaining({
        selectedUTXOIds: [getUTXOId(utxo)],
      }),
    )
    expect(navigateMock).toHaveBeenCalledWith('sendBitcoin')
  })
})
