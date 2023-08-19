import { fireEvent, render, waitFor } from '@testing-library/react-native'
import { toMatchDiffSnapshot } from 'snapshot-diff'
import { NavigationAndQueryClientWrapper } from '../../../tests/unit/helpers/NavigationAndQueryClientWrapper'
import { queryClient } from '../../../tests/unit/helpers/QueryClientWrapper'
import { PeachWallet } from '../../utils/wallet/PeachWallet'
import { peachWallet, setPeachWallet } from '../../utils/wallet/setWallet'
import { AddressChecker } from './AddressChecker'
expect.extend({ toMatchDiffSnapshot })

const validAddress = 'bcrt1qm50khyunelhjzhckvgy3qj0hn7xjzzwljhfgd0'
const invalidAddress = 'invalidAddress'

describe('AddressChecker', () => {
  beforeAll(() => {
    // @ts-ignore
    setPeachWallet(new PeachWallet())
  })

  it('should render correctly', () => {
    const { toJSON } = render(<AddressChecker />, { wrapper: NavigationAndQueryClientWrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly when address belongs to wallet', async () => {
    const { toJSON, getByPlaceholderText } = render(<AddressChecker />, { wrapper: NavigationAndQueryClientWrapper })
    const withoutAddress = toJSON()
    peachWallet.wallet = {
      isMine: () => true,
    } as any

    const addressInput = getByPlaceholderText('bc1q ...')
    fireEvent.changeText(addressInput, validAddress)

    await waitFor(() => {
      expect(queryClient.getQueryData(['isMine', validAddress])).toBe(true)
    })
    const withAddress = toJSON()
    expect(withoutAddress).toMatchDiffSnapshot(withAddress)
  })

  it('should render correctly when address does not belong to wallet', async () => {
    const { toJSON, getByPlaceholderText } = render(<AddressChecker />, { wrapper: NavigationAndQueryClientWrapper })
    const withoutAddress = toJSON()
    peachWallet.wallet = {
      isMine: () => false,
    } as any

    const addressInput = getByPlaceholderText('bc1q ...')
    fireEvent.changeText(addressInput, validAddress)

    await waitFor(() => {
      expect(queryClient.getQueryData(['isMine', validAddress])).toBe(false)
    })
    const withAddress = toJSON()
    expect(withoutAddress).toMatchDiffSnapshot(withAddress)
  })
  it('should render correctly when address is invalid', async () => {
    const { toJSON, getByPlaceholderText } = render(<AddressChecker />, { wrapper: NavigationAndQueryClientWrapper })
    const withoutAddress = toJSON()
    peachWallet.wallet = {
      isMine: () => false,
    } as any

    const addressInput = getByPlaceholderText('bc1q ...')
    fireEvent.changeText(addressInput, invalidAddress)

    await waitFor(() => {
      expect(queryClient.getQueryData(['isMine', invalidAddress])).toBe(undefined)
    })
    const withAddress = toJSON()
    expect(withoutAddress).toMatchDiffSnapshot(withAddress)
  })
})
