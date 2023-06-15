import { createRenderer } from 'react-test-renderer/shallow'
import { WrongFundingAmount } from './WrongFundingAmount'
import { sellOffer } from '../../../tests/unit/data/offerData'

const confirmEscrowMock = jest.fn()
const useWrongFundingAmountSetupMock = jest.fn().mockReturnValue({
  sellOffer,
  fundingAmount: sellOffer.amount,
  actualAmount: 69420,
  confirmEscrow: confirmEscrowMock,
})
jest.mock('./hooks/useWrongFundingAmountSetup', () => ({
  useWrongFundingAmountSetup: () => useWrongFundingAmountSetupMock(),
}))
describe('WrongFundingAmount', () => {
  const renderer = createRenderer()
  it('renders correctly', () => {
    renderer.render(<WrongFundingAmount />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
