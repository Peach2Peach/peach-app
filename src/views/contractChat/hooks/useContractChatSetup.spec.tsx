import { NavigationContext } from '@react-navigation/native'
import { renderHook } from '@testing-library/react-native'
import { account1 } from '../../../../tests/unit/data/accountData'
import { chat1 } from '../../../../tests/unit/data/chatData'
import { contract } from '../../../../tests/unit/data/contractData'
import { QueryClientWrapper } from '../../../../tests/unit/helpers/QueryClientWrapper'
import { configStore } from '../../../store/configStore'
import { setAccount } from '../../../utils/account'
import { useContractChatSetup } from './useContractChatSetup'
import { act } from 'react-test-renderer'

const useRouteMock = jest.fn(() => ({
  params: {
    contractId: contract.id,
  },
}))
jest.mock('../../../hooks/useRoute', () => ({
  useRoute: () => useRouteMock(),
}))

const replaceMock = jest.fn()
const useNavigationMock = jest.fn(() => ({
  replace: replaceMock,
}))
jest.mock('../../../hooks/useNavigation', () => ({
  useNavigation: () => useNavigationMock(),
}))

const getChatMock = jest.fn().mockResolvedValue([chat1])
jest.mock('../../../utils/peachAPI', () => ({
  getChat: () => getChatMock(),
}))

const useCommonContractSetupMock = jest.fn().mockReturnValue({ contract })
jest.mock('../../../hooks/useCommonContractSetup', () => ({
  useCommonContractSetup: () => useCommonContractSetupMock(),
}))

const showDisputeDisclaimerMock = jest.fn()
const useShowDisputeDisclaimerMock = jest.fn().mockReturnValue(showDisputeDisclaimerMock)
jest.mock('./useShowDisputeDisclaimer', () => ({
  useShowDisputeDisclaimer: () => useShowDisputeDisclaimerMock(),
}))
const useIsFocusedMock = jest.fn().mockReturnValue(true)
const useFocusEffectMock = jest.fn()
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useIsFocused: () => useIsFocusedMock(),
  useFocusEffect: () => useFocusEffectMock(),
}))

const NavigationWrapper = ({ children }: any) => (
  // @ts-ignore
  <NavigationContext.Provider value={{}}>
    <QueryClientWrapper>{children}</QueryClientWrapper>
  </NavigationContext.Provider>
)

jest.useFakeTimers()

describe('useContractChatSetup', () => {
  beforeEach(() => {
    setAccount({
      ...account1,
      chats: {
        [contract.id]: chat1,
      },
    })
  })
  afterEach(() => {
    act(() => {
      configStore.getState().reset()
    })
    jest.clearAllMocks()
  })
  it('open dispute disclaimer if not seen before', () => {
    renderHook(useContractChatSetup, { wrapper: NavigationWrapper })
    expect(showDisputeDisclaimerMock).toHaveBeenCalled()
  })
  it('should not open dispute disclaimer if has been seen before', () => {
    configStore.getState().setSeenDisputeDisclaimer(true)
    renderHook(useContractChatSetup, { wrapper: NavigationWrapper })
    expect(showDisputeDisclaimerMock).not.toHaveBeenCalled()
  })
  it('should not open dispute disclaimer if dispute is active', () => {
    const contractWithDispute = { ...contract, disputeActive: true }
    useCommonContractSetupMock.mockReturnValue({ contract: contractWithDispute })
    renderHook(useContractChatSetup, { wrapper: NavigationWrapper })
    expect(showDisputeDisclaimerMock).not.toHaveBeenCalled()
  })
})
