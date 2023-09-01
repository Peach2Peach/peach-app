import { renderHook, waitFor } from '@testing-library/react-native'
import { contract } from '../../../../tests/unit/data/contractData'
import { NavigationAndQueryClientWrapper } from '../../../../tests/unit/helpers/NavigationAndQueryClientWrapper'
import { replaceMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { useContractSetup } from './useContractSetup'

const now = new Date('2022-02-14T12:00:00.000Z')
jest.useFakeTimers({ now })

const wrapper = NavigationAndQueryClientWrapper

const refetchMock = jest.fn()
const useCommonContractSetupMock = jest.fn().mockReturnValue({
  contract,
  view: 'buyer',
  isLoading: false,
  refetch: refetchMock,
})
jest.mock('../../../hooks/useCommonContractSetup', () => ({
  useCommonContractSetup: () => useCommonContractSetupMock(),
}))

const useRouteMock = jest.fn(() => ({
  params: { contractId: contract.id },
}))
jest.mock('../../../hooks/useRoute', () => ({
  useRoute: () => useRouteMock(),
}))

const useIsFocusedMock = jest.fn().mockReturnValue(true)
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useIsFocused: () => useIsFocusedMock(),
}))

describe('useContractSetup', () => {
  const completedContract = { ...contract, paymentConfirmed: now }

  it('navigates to trade complete if trade is complete and user did not yet rate', async () => {
    useCommonContractSetupMock.mockReturnValueOnce({
      contract: completedContract,
      view: 'buyer',
      isLoading: false,
      refetch: refetchMock,
    })
    refetchMock.mockResolvedValueOnce({ data: completedContract })
    renderHook(useContractSetup, { wrapper })

    await waitFor(() => expect(replaceMock).toHaveBeenCalled())
    expect(replaceMock).toHaveBeenCalledWith('tradeComplete', { contract: completedContract })
  })
  it('does not navigate to trade complete if not in focus', () => {
    useCommonContractSetupMock.mockReturnValueOnce({
      contract: completedContract,
      view: 'buyer',
      isLoading: false,
      refetch: refetchMock,
    })
    useIsFocusedMock.mockReturnValueOnce(false)
    refetchMock.mockResolvedValueOnce({ data: completedContract })
    renderHook(useContractSetup, { wrapper })

    expect(refetchMock).not.toHaveBeenCalled()
    expect(replaceMock).not.toHaveBeenCalled()
  })
})
