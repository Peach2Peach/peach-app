import { createRenderer } from 'react-test-renderer/shallow'
import { WrongFundingAmount } from './WrongFundingAmount'
import { sellOffer } from '../../../tests/unit/data/offerData'

const useWrongFundingAmountSetupMock = jest.fn().mockReturnValue({ sellOffer })
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
