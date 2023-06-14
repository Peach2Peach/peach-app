import { sellOffer } from '../../../tests/unit/data/offerData'
import { defaultFundingStatus } from '../../utils/offer/constants'
import FundEscrow from './FundEscrow'
import { createRenderer } from 'react-test-renderer/shallow'

const useFundEscrowSetupMock = jest.fn()
jest.mock('./hooks/useFundEscrowSetup', () => ({
  useFundEscrowSetup: () => useFundEscrowSetupMock(),
}))
const useFundFromPeachWalletMock = jest.fn().mockReturnValue({
  canFundFromPeachWallet: false,
  fundFromPeachWallet: jest.fn(),
})
jest.mock('./hooks/useFundFromPeachWallet', () => ({
  useFundFromPeachWallet: () => useFundFromPeachWalletMock(),
}))

describe('FundEscrow', () => {
  const defaultReturnValue = {
    offerId: sellOffer.id,
    offer: sellOffer,
    escrow: '123',
    fundingStatus: defaultFundingStatus,
    fundingAmount: 100000,
    createEscrowError: null,
  }
  const renderer = createRenderer()

  it('should render the FundEscrow view', () => {
    useFundEscrowSetupMock.mockReturnValueOnce(defaultReturnValue)
    renderer.render(<FundEscrow />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render the FundEscrow view with fund from peach wallet button', () => {
    useFundEscrowSetupMock.mockReturnValueOnce(defaultReturnValue)
    useFundFromPeachWalletMock.mockReturnValueOnce({
      canFundFromPeachWallet: true,
      fundFromPeachWallet: jest.fn(),
    })
    renderer.render(<FundEscrow />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })

  it('should show Loading, while escrow creation is pending', () => {
    useFundEscrowSetupMock.mockReturnValueOnce({
      ...defaultReturnValue,
      isLoading: true,
    })
    renderer.render(<FundEscrow />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should show Loading, while escrow is not defined', () => {
    useFundEscrowSetupMock.mockReturnValueOnce({
      ...defaultReturnValue,
      loading: false,
      escrow: undefined,
    })
    renderer.render(<FundEscrow />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })

  it('should show NoEscrowFound, if no there is an error while creating escrow', () => {
    useFundEscrowSetupMock.mockReturnValueOnce({
      ...defaultReturnValue,
      escrow: '',
      isLoading: false,
      createEscrowError: new Error('UNAUTHORIZED'),
    })
    renderer.render(<FundEscrow />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })

  it('should show TransactionInMempool, if fundingStatus is MEMPOOL', () => {
    useFundEscrowSetupMock.mockReturnValueOnce({
      ...defaultReturnValue,
      isLoading: false,
      fundingStatus: {
        ...defaultFundingStatus,
        status: 'MEMPOOL',
      },
    })
    renderer.render(<FundEscrow />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
