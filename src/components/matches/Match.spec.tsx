import { Match } from './Match'
import { render } from '@testing-library/react-native'
import { buyOffer, matchOffer, sellOffer } from '../../../tests/unit/data/offerData'
import { NavigationAndQueryClientWrapper } from '../../../tests/unit/helpers/NavigationAndQueryClientWrapper'

describe('Match', () => {
  it('should render correctly for buy offers', () => {
    const { toJSON } = render(<Match match={matchOffer} offer={buyOffer} />, {
      wrapper: NavigationAndQueryClientWrapper,
    })
    expect(toJSON()).toMatchSnapshot()
  })

  it('should render correctly for sell offers', () => {
    const { toJSON } = render(<Match match={matchOffer} offer={sellOffer} />, {
      wrapper: NavigationAndQueryClientWrapper,
    })
    expect(toJSON()).toMatchSnapshot()
  })
})
