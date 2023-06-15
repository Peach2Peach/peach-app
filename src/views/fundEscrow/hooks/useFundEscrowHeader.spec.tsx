import { renderHook } from '@testing-library/react-native'
import { account1 } from '../../../../tests/unit/data/accountData'
import { sellOffer } from '../../../../tests/unit/data/offerData'
import { NavigationWrapper, headerState, setOptionsMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { updateAccount } from '../../../utils/account'
import { useFundEscrowHeader } from './useFundEscrowHeader'
import { defaultFundingStatus } from '../../../utils/offer/constants'

const showHelpMock = jest.fn()
const useShowHelpMock = jest.fn((..._args) => showHelpMock)
jest.mock('../../../hooks/useShowHelp', () => ({
  useShowHelp: (...args: any) => useShowHelpMock(...args),
}))

const wrapper = NavigationWrapper

const cancelOfferMock = jest.fn()
jest.mock('../../../hooks/useCancelOffer', () => ({
  useCancelOffer: () => cancelOfferMock,
}))

describe('useFundEscrowHeader', () => {
  beforeEach(() => {
    setOptionsMock({ header: { title: '', icons: [] } })

    updateAccount({ ...account1, offers: [] }, true)
  })

  it('should render header correctly for unfunded offers', () => {
    renderHook(useFundEscrowHeader, {
      wrapper,
      initialProps: {
        fundingStatus: defaultFundingStatus,
        sellOffer,
      },
    })
    expect(headerState.header()).toMatchSnapshot()
    expect(headerState.header().props.icons?.[0].onPress).toEqual(cancelOfferMock)
    expect(headerState.header().props.icons?.[1].onPress).toEqual(showHelpMock)
  })
  it('should render header correctly for funding in mempool', () => {
    renderHook(useFundEscrowHeader, {
      wrapper,
      initialProps: {
        fundingStatus: { ...defaultFundingStatus, status: 'MEMPOOL' },
        sellOffer,
      },
    })
    expect(headerState.header()).toMatchSnapshot()
    expect(headerState.header().props.icons?.[0].onPress).toEqual(showHelpMock)
  })
})
