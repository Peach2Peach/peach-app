import { renderHook } from '@testing-library/react-native'
import { contract } from '../../../../tests/unit/data/contractData'
import { NavigationWrapper, navigateMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { usePopupStore } from '../../../store/usePopupStore'
import { contractIdToHex } from '../../../utils/contract'
import { DisputeLostBuyer } from '../components/DisputeLostBuyer'
import { DisputeLostSeller } from '../components/DisputeLostSeller'
import NonDispute from '../components/NonDispute'
import { useDisputeResults } from './useDisputeResults'

describe('useDisputeResults', () => {
  it('opens dispute results popup for non disputes', () => {
    const { result } = renderHook(useDisputeResults, { wrapper: NavigationWrapper })
    result.current({ ...contract }, 'buyer')

    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      action1: {
        callback: expect.any(Function),
        icon: 'messageCircle',
        label: 'go to chat',
      },
      action2: {
        callback: expect.any(Function),
        icon: 'xSquare',
        label: 'close',
      },
      content: <NonDispute tradeId={contractIdToHex(contract.id)} />,
      level: 'WARN',
      title: 'dispute closed',
      visible: true,
    })
  })
  it('opens dispute results popup for buyer as loser', () => {
    const { result } = renderHook(useDisputeResults, { wrapper: NavigationWrapper })
    result.current({ ...contract, disputeWinner: 'seller' }, 'buyer')

    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      action1: {
        callback: expect.any(Function),
        icon: 'messageCircle',
        label: 'go to chat',
      },
      action2: {
        callback: expect.any(Function),
        icon: 'xSquare',
        label: 'close',
      },
      content: <DisputeLostBuyer tradeId={contractIdToHex(contract.id)} />,
      level: 'WARN',
      title: 'dispute lost...',
      visible: true,
    })
  })
  it('opens dispute results popup for seller as loser and funds not released', () => {
    const { result } = renderHook(useDisputeResults, { wrapper: NavigationWrapper })
    result.current({ ...contract, disputeWinner: 'buyer' }, 'seller')

    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      action1: {
        callback: expect.any(Function),
        icon: 'sell',
        label: 'release funds',
      },
      content: <DisputeLostSeller tradeId={contractIdToHex(contract.id)} isCompleted={false} />,
      level: 'WARN',
      title: 'dispute lost...',
      visible: true,
    })
  })
  it('opens dispute results popup for seller as loser and funds released', () => {
    const { result } = renderHook(useDisputeResults, { wrapper: NavigationWrapper })
    result.current({ ...contract, releaseTxId: 'releaseTxId', disputeWinner: 'buyer' }, 'seller')
    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      action1: {
        callback: expect.any(Function),
        icon: 'xSquare',
        label: 'close',
      },
      content: <DisputeLostSeller tradeId={contractIdToHex(contract.id)} isCompleted={true} />,
      level: 'WARN',
      title: 'dispute lost...',
      visible: true,
    })

    usePopupStore.getState().action1?.callback()
    expect(usePopupStore.getState().visible).toEqual(false)
  })
  it('closes popup', () => {
    const { result } = renderHook(useDisputeResults, { wrapper: NavigationWrapper })
    result.current(contract, 'buyer')
    usePopupStore.getState().action2?.callback()
    expect(usePopupStore.getState().visible).toEqual(false)
  })
  it('goes to chat', () => {
    const { result } = renderHook(useDisputeResults, { wrapper: NavigationWrapper })
    result.current(contract, 'buyer')
    usePopupStore.getState().action1?.callback()
    expect(navigateMock).toHaveBeenCalledWith('contractChat', { contractId: contract.id })
    expect(usePopupStore.getState().visible).toEqual(false)
  })
})
