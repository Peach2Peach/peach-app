import { Script } from 'bdk-rn/lib/classes/Script'
import { Network } from 'bdk-rn/lib/lib/enums'
import { render, waitFor } from 'test-utils'
import { queryClient } from '../../../../tests/unit/helpers/QueryClientWrapper'
import { PeachWallet } from '../../../utils/wallet/PeachWallet'
import { setPeachWallet } from '../../../utils/wallet/setWallet'
import { useWalletState } from '../../../utils/wallet/walletStore'
import { UTXOAddress } from './UTXOAddress'

jest.useFakeTimers()

describe('UTXOAddress', () => {
  const script = new Script('address')
  beforeAll(() => {
    // @ts-expect-error mock doesn't need args
    setPeachWallet(new PeachWallet({ network: Network.Testnet }))
  })
  it('should render correctly', async () => {
    useWalletState.setState({ addressLabelMap: { address: 'addressLabel' } })
    const { toJSON } = render(<UTXOAddress script={script} />)

    await waitFor(() => {
      expect(queryClient.isFetching()).toBe(0)
      expect(queryClient.getQueryData(['address', script.id])).toBe('address')
    })

    expect(toJSON()).toMatchSnapshot()
  })
})
