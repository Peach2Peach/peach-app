import { useDisputeWonPopup } from './useDisputeWonPopup'
import { renderHook, waitFor } from '@testing-library/react-native'
import { NavigationWrapper, navigateMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { saveChat } from '../../../utils/chat'
import { contractIdToHex, saveContract } from '../../../utils/contract'
import { account } from '../../../utils/account'
import { defaultPopupState, usePopupStore } from '../../../store/usePopupStore'
import { QueryClientWrapper } from '../../../../tests/unit/helpers/QueryClientWrapper'
import { DisputeWon } from '../components/DisputeWon'
import { useLocalContractStore } from '../../../store/useLocalContractStore'

const wrapper = ({ children }: ComponentProps) => (
  <QueryClientWrapper>
    <NavigationWrapper>{children}</NavigationWrapper>
  </QueryClientWrapper>
)

const getChatMock = jest.fn()
jest.mock('../../../utils/chat', () => ({
  getChat: (contractId: string) => getChatMock(contractId),
  saveChat: jest.fn(),
}))
jest.mock('../../../utils/contract', () => ({
  contractIdToHex: jest.fn((id) => id),
  saveContract: jest.fn(),
}))
jest.mock('../../../utils/account')
const DATE_TO_USE = new Date('2009-09-01')
jest.spyOn(global, 'Date').mockImplementation(() => DATE_TO_USE)

const mockContract = {
  id: '21',
  buyer: {
    id: 'buyer',
  },
  disputeWinner: 'buyer',
  disputeActive: false,
  disputeResolvedDate: new Date('2009-08-01'),
} as Contract | undefined
const useContractDetailsMock = jest.fn((_contractId) => ({
  contract: mockContract,
}))
jest.mock('../../../hooks/query/useContractDetails', () => ({
  useContractDetails: (contactId: string) => useContractDetailsMock(contactId),
}))

const getContractMock = jest.fn((_contractId: string) => Promise.resolve([mockContract, null]))
jest.mock('../../../utils/peachAPI', () => ({
  getContract: (contractId: string) => getContractMock(contractId),
}))

describe('useDisputeWonPopup', () => {
  afterEach(() => {
    jest.clearAllMocks()
    usePopupStore.setState(defaultPopupState)
  })
  it('should not do anything if the contract is not loaded', () => {
    useContractDetailsMock.mockReturnValueOnce({ contract: undefined })
    const { result } = renderHook(useDisputeWonPopup, { wrapper, initialProps: '21' })
    result.current('21')
    expect(contractIdToHex).not.toHaveBeenCalled()
    expect(getChatMock).not.toHaveBeenCalled()
    expect(saveChat).not.toHaveBeenCalled()
    expect(usePopupStore.getState()).toStrictEqual(expect.objectContaining(defaultPopupState))
  })

  it('should not do anything if the dispute winner is not the current user', () => {
    const { result } = renderHook(useDisputeWonPopup, { wrapper, initialProps: '21' })
    result.current('21')
    expect(contractIdToHex).not.toHaveBeenCalled()
    expect(getChatMock).not.toHaveBeenCalled()
    expect(saveChat).not.toHaveBeenCalled()
    expect(usePopupStore.getState()).toStrictEqual(expect.objectContaining(defaultPopupState))
  })

  it('should navigate to the chat, save the contract and close the popup on action1', async () => {
    getContractMock.mockReturnValueOnce([{ ...mockContract, disputeWinner: 'seller' }, null])
    getChatMock.mockReturnValueOnce({ id: 'chatId' })
    const { result } = renderHook(useDisputeWonPopup, { wrapper, initialProps: '21' })
    await result.current('21')
    usePopupStore.getState().action1?.callback()
    expect(saveContract).toHaveBeenCalledWith({
      ...mockContract,
      disputeWinner: 'seller',
      disputeResolvedDate: DATE_TO_USE,
    })
    expect(useLocalContractStore.getState().contracts['21']).toStrictEqual({
      disputeResultAcknowledged: true,
      cancelConfirmationDismissed: false,
    })
    expect(usePopupStore.getState().visible).toBe(false)
    expect(navigateMock).toHaveBeenCalledWith('contractChat', { contractId: '21' })
  })

  it('save the contract and close the popup on action2', async () => {
    getContractMock.mockReturnValueOnce([{ ...mockContract, disputeWinner: 'seller' }, null])
    getChatMock.mockReturnValueOnce({ id: 'chatId' })
    const { result } = renderHook(useDisputeWonPopup, { wrapper, initialProps: '21' })
    await result.current('21')
    usePopupStore.getState().action2?.callback()
    expect(saveContract).toHaveBeenCalledWith({
      ...mockContract,
      disputeWinner: 'seller',
      disputeResolvedDate: DATE_TO_USE,
    })
    expect(useLocalContractStore.getState().contracts['21']).toStrictEqual({
      disputeResultAcknowledged: true,
      cancelConfirmationDismissed: false,
    })
    expect(usePopupStore.getState().visible).toBe(false)
    expect(navigateMock).not.toHaveBeenCalled()
  })

  it('should handle the case of the buyer being the viewer', async () => {
    getContractMock.mockReturnValueOnce([{ ...mockContract, buyer: { id: account.publicKey } }, null])
    getChatMock.mockReturnValueOnce({ id: 'chatId' })
    const { result } = renderHook(useDisputeWonPopup, { wrapper, initialProps: '21' })
    await result.current('21')
    expect(usePopupStore.getState()).toStrictEqual(
      expect.objectContaining({
        level: 'SUCCESS',
        content: <DisputeWon tradeId="21" />,
        visible: true,
        action2: {
          label: 'close',
          icon: 'xSquare',
          callback: expect.any(Function),
        },
        action1: {
          label: 'go to chat',
          icon: 'messageCircle',
          callback: expect.any(Function),
        },
      }),
    )
  })
})
