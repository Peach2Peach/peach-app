import { NavigationContext } from '@react-navigation/native'
import { renderHook } from '@testing-library/react-native'
import { account1 } from '../../../../tests/unit/data/accountData'
import { chat1 } from '../../../../tests/unit/data/chatData'
import { contract } from '../../../../tests/unit/data/contractData'
import { QueryClientWrapper } from '../../../../tests/unit/helpers/QueryClientWrapper'
import { setAccount } from '../../../utils/account'
import { useContractChatSetup } from './useContractChatSetup'
import { saveChat } from '../../../utils/chat'
import { saveContract } from '../../../utils/contract'

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

const getContractMock = jest.fn().mockResolvedValue([contract])
jest.mock('../../../utils/peachAPI', () => ({
  getContract: () => getContractMock(),
}))

const showDisputeDisclaimerMock = jest.fn()
const useShowDisputeDisclaimerMock = jest.fn().mockReturnValue(showDisputeDisclaimerMock)
jest.mock('../utils/useShowDisputeDisclaimer', () => ({
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
  <NavigationContext.Provider>
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
    jest.clearAllMocks()
  })
  it('open dispute disclaimer if not seen before', async () => {
    renderHook(useContractChatSetup, { wrapper: NavigationWrapper })
    expect(showDisputeDisclaimerMock).toHaveBeenCalled()
  })
  it('should not open dispute disclaimer if has been seen before', async () => {
    saveChat(contract.id, {
      seenDisputeDisclaimer: true,
    })
    renderHook(useContractChatSetup, { wrapper: NavigationWrapper })
    expect(showDisputeDisclaimerMock).not.toHaveBeenCalled()
  })
  it('should not open dispute disclaimer if dispute is active', async () => {
    const contractWithDispute = { ...contract, disputeActive: true }
    saveContract(contractWithDispute)
    getContractMock.mockResolvedValueOnce([contractWithDispute])
    renderHook(useContractChatSetup, { wrapper: NavigationWrapper })
    expect(showDisputeDisclaimerMock).not.toHaveBeenCalled()
  })
})
