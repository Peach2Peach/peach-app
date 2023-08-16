import { fireEvent, render, waitFor } from '@testing-library/react-native'
import { LocalUtxo, OutPoint, TxOut } from 'bdk-rn/lib/classes/Bindings'
import { Script } from 'bdk-rn/lib/classes/Script'
import { KeychainKind } from 'bdk-rn/lib/lib/enums'
import { confirmed1 } from '../../../tests/unit/data/transactionDetailData'
import { NavigationAndQueryClientWrapper } from '../../../tests/unit/helpers/NavigationAndQueryClientWrapper'
import { queryClient } from '../../../tests/unit/helpers/QueryClientWrapper'
import { CoinControl } from '../../popups/info/CoinControl'
import { usePopupStore } from '../../store/usePopupStore'
import { PeachWallet } from '../../utils/wallet/PeachWallet'
import { peachWallet, setPeachWallet } from '../../utils/wallet/setWallet'
import { CoinSelection } from './CoinSelection'

jest.useFakeTimers()

const wrapper = NavigationAndQueryClientWrapper
describe('CoinSelection', () => {
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
  it.todo('renders correctly while loading')
  it.todo('renders correctly')
  it.todo('selects coins')
  it.todo('saves selection and navigates to "sendBitcoin" when "confirm" is pressed')
})
