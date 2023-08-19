import { fireEvent, render, waitFor } from '@testing-library/react-native'
import { LocalUtxo, OutPoint, TxOut } from 'bdk-rn/lib/classes/Bindings'
import { Script } from 'bdk-rn/lib/classes/Script'
import { KeychainKind } from 'bdk-rn/lib/lib/enums'
import { toMatchDiffSnapshot } from 'snapshot-diff'
import { confirmed1 } from '../../../tests/unit/data/transactionDetailData'
import { NavigationAndQueryClientWrapper } from '../../../tests/unit/helpers/NavigationAndQueryClientWrapper'
import { navigateMock } from '../../../tests/unit/helpers/NavigationWrapper'
import { queryClient } from '../../../tests/unit/helpers/QueryClientWrapper'
import { CoinControl } from '../../popups/info/CoinControl'
import { usePopupStore } from '../../store/usePopupStore'
import { getUTXOId } from '../../utils/wallet'
import { PeachWallet } from '../../utils/wallet/PeachWallet'
import { peachWallet, setPeachWallet } from '../../utils/wallet/setWallet'
import { useWalletState } from '../../utils/wallet/walletStore'
import { CoinSelection } from './CoinSelection'
expect.extend({ toMatchDiffSnapshot })

jest.useFakeTimers()

const wrapper = NavigationAndQueryClientWrapper
describe('CoinSelection', () => {
  const outpoint = new OutPoint(confirmed1.txid, 0)
  const script = new Script('address')
  const txOut = new TxOut(10000, script)
  const utxo = new LocalUtxo(outpoint, txOut, false, KeychainKind.External)
  const listUnspentMock = jest.fn().mockResolvedValue([utxo])

  beforeAll(() => {
    // @ts-ignore
    setPeachWallet(new PeachWallet())
    // @ts-ignore
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
    const { getByAccessibilityHint } = render(<CoinSelection />, { wrapper })

    await waitFor(() => {
      expect(queryClient.getQueryData(['utxos'])).toStrictEqual([utxo])
    })
    const helpIcon = getByAccessibilityHint('help')

    fireEvent.press(helpIcon)

    expect(usePopupStore.getState()).toStrictEqual(
      expect.objectContaining({
        title: 'coin control',
        content: <CoinControl />,
        visible: true,
      }),
    )
  })
  it('renders correctly while loading', () => {
    const { toJSON } = render(<CoinSelection />, { wrapper })

    expect(toJSON()).toMatchSnapshot()
  })
  it('renders correctly', async () => {
    const { toJSON } = render(<CoinSelection />, { wrapper })

    await waitFor(() => {
      expect(queryClient.getQueryData(['utxos'])).toStrictEqual([utxo])
      expect(queryClient.getQueryData(['address', script.id])).toStrictEqual('address')
    })

    expect(toJSON()).toMatchSnapshot()
  })
  it('selects coins', async () => {
    const { toJSON, getByTestId } = render(<CoinSelection />, { wrapper })

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
    const { getByText, getByTestId } = render(<CoinSelection />, { wrapper })

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
