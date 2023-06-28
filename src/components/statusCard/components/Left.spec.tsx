import { Left } from './Left'
import { fireEvent, render, waitFor } from '@testing-library/react-native'
import Icon from '../../Icon'
import tw from '../../../styles/tailwind'
import { navigateMock, NavigationWrapper } from '../../../../tests/unit/helpers/NavigationWrapper'
import { contract } from '../../../../tests/unit/data/contractData'
import { sellOffer } from '../../../../tests/unit/data/offerData'
import { contractIdToHex } from '../../../utils/contract'
import { offerIdToHex } from '../../../utils/offer'

const getContractMock = jest.fn(() => Promise.resolve([contract, null]))
const getOfferDetailsMock = jest.fn(() => Promise.resolve([{ ...sellOffer, tradeStatus: 'searchingForPeer' }, null]))
jest.mock('../../../utils/peachAPI', () => ({
  getContract: () => getContractMock(),
  getOfferDetails: () => getOfferDetailsMock(),
}))

describe('Left', () => {
  it('should render correctly with a title and date', () => {
    const { toJSON } = render(<Left title="title" subtext="date" />, { wrapper: NavigationWrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly with title, icon and date', () => {
    const { toJSON } = render(
      <Left title="title" subtext="date" icon={<Icon style={tw`w-17px h-17px`} id="bitcoinLogo" />} />,
      { wrapper: NavigationWrapper },
    )
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly when replaced', () => {
    const { toJSON } = render(<Left title="title" subtext="date" replaced />, { wrapper: NavigationWrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('should redirect to the new offer if it is replaced', async () => {
    const offerIDHex = offerIdToHex(sellOffer.id)
    const { getByText } = render(<Left title="title" subtext={offerIDHex} replaced />, { wrapper: NavigationWrapper })
    fireEvent.press(getByText(offerIDHex))
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('search', { offerId: sellOffer.id })
    })
  })
  it('should redirect to the new contract, if it is replaced and a contract exists', async () => {
    const contractIDHex = contractIdToHex(contract.id)
    const { getByText } = render(<Left title="title" subtext={contractIDHex} replaced />, {
      wrapper: NavigationWrapper,
    })
    fireEvent.press(getByText(contractIDHex))
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('contract', { contractId: contract.id })
    })
  })
  it('should not redirect if it is not replaced', async () => {
    const offerIDHex = offerIdToHex(sellOffer.id)
    const { getByText } = render(<Left title="title" subtext={offerIDHex} />, { wrapper: NavigationWrapper })
    fireEvent.press(getByText(offerIDHex))
    await waitFor(() => {
      expect(navigateMock).not.toHaveBeenCalled()
    })
  })
})