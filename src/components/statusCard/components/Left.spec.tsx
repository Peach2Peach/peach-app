import { fireEvent, render, responseUtils, waitFor } from 'test-utils'
import { contract } from '../../../../tests/unit/data/contractData'
import { sellOffer } from '../../../../tests/unit/data/offerData'
import { navigateMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import tw from '../../../styles/tailwind'
import { contractIdToHex } from '../../../utils/contract'
import { offerIdToHex } from '../../../utils/offer'
import { peachAPI } from '../../../utils/peachAPI'
import { Icon } from '../../Icon'
import { Left } from './Left'

jest
  .spyOn(peachAPI.private.offer, 'getOfferDetails')
  .mockResolvedValue({ result: { ...sellOffer, tradeStatus: 'searchingForPeer' }, ...responseUtils })

describe('Left', () => {
  it('should render correctly with a title and date', () => {
    const { toJSON } = render(<Left title="title" subtext="date" />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly with title, icon and date', () => {
    const { toJSON } = render(
      <Left title="title" subtext="date" icon={<Icon style={tw`w-17px h-17px`} id="bitcoinLogo" />} />,
    )
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly when replaced', () => {
    const { toJSON } = render(<Left title="title" subtext="date" replaced />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should redirect to the new offer if it is replaced', async () => {
    const offerIDHex = offerIdToHex(sellOffer.id)
    const { getByText } = render(<Left title="title" subtext={offerIDHex} replaced />)
    fireEvent.press(getByText(offerIDHex))
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('search', { offerId: sellOffer.id })
    })
  })
  it('should redirect to the new contract, if it is replaced and a contract exists', async () => {
    const contractIDHex = contractIdToHex(contract.id)
    const { getByText } = render(<Left title="title" subtext={contractIDHex} replaced />)
    fireEvent.press(getByText(contractIDHex))
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('contract', { contractId: contract.id })
    })
  })
  it('should not redirect if it is not replaced', async () => {
    const offerIDHex = offerIdToHex(sellOffer.id)
    const { getByText } = render(<Left title="title" subtext={offerIDHex} />)
    fireEvent.press(getByText(offerIDHex))
    await waitFor(() => {
      expect(navigateMock).not.toHaveBeenCalled()
    })
  })
})
