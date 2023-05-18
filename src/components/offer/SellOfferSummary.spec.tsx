import { fireEvent, render } from '@testing-library/react-native'
import { Linking } from 'react-native'
import { createRenderer } from 'react-test-renderer/shallow'
import { sellOffer } from '../../../tests/unit/data/offerData'
import { getSellOfferDraft } from '../../../tests/unit/data/offerDraftData'
import { PeachWallet } from '../../utils/wallet/PeachWallet'
import { setPeachWallet } from '../../utils/wallet/setWallet'
import { SellOfferSummary } from './SellOfferSummary'

jest.useFakeTimers({ now: new Date('2023-04-26T14:58:49.437Z') })

describe('SellOfferSummary', () => {
  const renderer = createRenderer()

  it('renders correctly', () => {
    renderer.render(<SellOfferSummary offer={sellOffer} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly for sell offers drafts', () => {
    renderer.render(<SellOfferSummary offer={getSellOfferDraft()} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('opens escrow link', () => {
    const escrowAddress = 'escrowAddress'
    // @ts-ignore
    setPeachWallet(new PeachWallet())
    const { getByTestId } = render(<SellOfferSummary offer={{ ...sellOffer, escrow: escrowAddress }} />)
    const openURL = jest.spyOn(Linking, 'openURL')

    fireEvent(getByTestId('showEscrow'), 'onPress')
    expect(openURL).toHaveBeenCalledWith('https://mempool.space/testnet/address/escrowAddress')
  })
})
