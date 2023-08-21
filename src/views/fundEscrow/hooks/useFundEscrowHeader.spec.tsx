import { renderHook } from '@testing-library/react-native'
import { networks } from 'bitcoinjs-lib'
import { sellOffer } from '../../../../tests/unit/data/offerData'
import { NavigationWrapper, headerState, setOptionsMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { defaultFundingStatus } from '../../../utils/offer/constants'
import { generateBlock } from '../../../utils/regtest'
import { useFundEscrowHeader } from './useFundEscrowHeader'

const showHelpMock = jest.fn()
const useShowHelpMock = jest.fn((..._args) => showHelpMock)
jest.mock('../../../hooks/useShowHelp', () => ({
  useShowHelp: (...args: unknown[]) => useShowHelpMock(...args),
}))

const wrapper = NavigationWrapper

const cancelOfferMock = jest.fn()
jest.mock('../../../hooks/useCancelOffer', () => ({
  useCancelOffer: () => cancelOfferMock,
}))

const getNetworkMock = jest.fn().mockReturnValue(networks.bitcoin)
jest.mock('../../../utils/wallet', () => ({
  getNetwork: () => getNetworkMock(),
}))

describe('useFundEscrowHeader', () => {
  beforeEach(() => {
    setOptionsMock({ header: { title: '', icons: [] } })
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

  it('should show regtest icons', () => {
    getNetworkMock.mockReturnValueOnce(networks.regtest)
    renderHook(useFundEscrowHeader, {
      wrapper,
      initialProps: {
        fundingStatus: defaultFundingStatus,
        sellOffer,
      },
    })
    expect(headerState.header()).toMatchSnapshot()
    expect(headerState.header().props.icons?.[0].onPress).toEqual(generateBlock)
    expect(headerState.header().props.icons?.[1].onPress).toEqual(cancelOfferMock)
    expect(headerState.header().props.icons?.[2].onPress).toEqual(showHelpMock)
  })
})
