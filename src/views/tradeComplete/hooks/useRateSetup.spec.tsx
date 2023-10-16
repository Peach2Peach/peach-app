import { act, renderHook } from 'test-utils'
import { account1 } from '../../../../tests/unit/data/accountData'
import { contract } from '../../../../tests/unit/data/contractData'
import { apiSuccess, unauthorizedError } from '../../../../tests/unit/data/peachAPIData'
import { replaceMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { TradeBreakdown } from '../../../popups/TradeBreakdown'
import { useSettingsStore } from '../../../store/settingsStore'
import { usePopupStore } from '../../../store/usePopupStore'
import { Props, useRateSetup } from './useRateSetup'

const showErrorBannerMock = jest.fn()
const useShowErrorBannerMock = jest.fn().mockReturnValue(showErrorBannerMock)
jest.mock('../../../hooks/useShowErrorBanner', () => ({
  useShowErrorBanner: () => useShowErrorBannerMock(),
}))

const rateUserMock = jest.fn().mockResolvedValue([apiSuccess, null])
jest.mock('../../../utils/peachAPI', () => ({
  rateUser: (...args: unknown[]) => rateUserMock(...args),
}))

const createUserRatingMock = jest.fn()
jest.mock('../../../utils/contract', () => ({
  createUserRating: (...args: unknown[]) => createUserRatingMock(...args),
}))

const showTransactionMock = jest.fn()
const showAddressMock = jest.fn()
jest.mock('../../../utils/bitcoin', () => ({
  showTransaction: (...args: unknown[]) => showTransactionMock(...args),
  showAddress: (...args: unknown[]) => showAddressMock(...args),
}))

// eslint-disable-next-line max-lines-per-function
describe('useRateSetup', () => {
  const now = new Date()
  const positiveRating = {
    creationDate: now,
    rating: 1,
    ratedBy: account1.publicKey,
    signature: 'signature',
  }
  const negativeRating = {
    creationDate: now,
    rating: -1,
    ratedBy: account1.publicKey,
    signature: 'signature',
  }
  const saveAndUpdateMock = jest.fn()
  const initialProps: Props = { contract, view: 'buyer', vote: undefined, saveAndUpdate: saveAndUpdateMock }

  beforeEach(() => {
    useSettingsStore.getState().reset()
    useSettingsStore.getState().setShowBackupReminder(false)
  })
  it('returns default values correctly', () => {
    const { result } = renderHook(useRateSetup, { initialProps })

    expect(result.current).toEqual({
      rate: expect.any(Function),
      showTradeBreakdown: expect.any(Function),
      viewInExplorer: expect.any(Function),
    })
  })
  it('does not submit rating if none has been set', async () => {
    const { result } = renderHook(useRateSetup, { initialProps })
    await act(async () => {
      await result.current.rate()
    })
    expect(rateUserMock).not.toHaveBeenCalled()
  })
  it('does submit rating as buyer', async () => {
    createUserRatingMock.mockReturnValueOnce(positiveRating)
    const { result } = renderHook(useRateSetup, { initialProps: { ...initialProps, vote: 'positive', view: 'buyer' } })
    await act(async () => {
      await result.current.rate()
    })
    expect(rateUserMock).toHaveBeenCalledWith({
      contractId: contract.id,
      rating: positiveRating.rating,
      signature: positiveRating.signature,
    })
    expect(saveAndUpdateMock).toHaveBeenCalledWith({
      ...contract,
      ratingSeller: 1,
    })
  })
  it('does submit rating as seller', async () => {
    createUserRatingMock.mockReturnValueOnce(positiveRating)
    const { result } = renderHook(useRateSetup, { initialProps: { ...initialProps, vote: 'positive', view: 'seller' } })
    await act(async () => {
      await result.current.rate()
    })
    expect(rateUserMock).toHaveBeenCalledWith({
      contractId: contract.id,
      rating: positiveRating.rating,
      signature: positiveRating.signature,
    })
    expect(saveAndUpdateMock).toHaveBeenCalledWith({
      ...contract,
      ratingBuyer: 1,
    })
  })
  it('does submit positive rating and navigates to backupTime', async () => {
    useSettingsStore.getState().setShowBackupReminder(true)
    createUserRatingMock.mockReturnValueOnce(positiveRating)
    const { result } = renderHook(useRateSetup, { initialProps: { ...initialProps, vote: 'positive' } })
    await act(async () => {
      await result.current.rate()
    })
    expect(rateUserMock).toHaveBeenCalledWith({
      contractId: contract.id,
      rating: positiveRating.rating,
      signature: positiveRating.signature,
    })
    expect(replaceMock).toHaveBeenCalledWith('backupTime', {
      nextScreen: 'contract',
      contractId: contract.id,
    })
  })
  it('does submit negative rating and navigates to backupTime', async () => {
    useSettingsStore.getState().setShowBackupReminder(true)
    createUserRatingMock.mockReturnValueOnce(negativeRating)
    const { result } = renderHook(useRateSetup, { initialProps: { ...initialProps, vote: 'negative' } })
    await act(async () => {
      await result.current.rate()
    })
    expect(rateUserMock).toHaveBeenCalledWith({
      contractId: contract.id,
      rating: negativeRating.rating,
      signature: negativeRating.signature,
    })
    expect(replaceMock).toHaveBeenCalledWith('backupTime', {
      nextScreen: 'yourTrades',
    })
  })
  it('does submit positive rating and navigates back to contract', async () => {
    useSettingsStore.getState().setShowBackupReminder(false)
    createUserRatingMock.mockReturnValueOnce(positiveRating)
    const { result } = renderHook(useRateSetup, { initialProps: { ...initialProps, vote: 'positive' } })
    await act(async () => {
      await result.current.rate()
    })
    expect(replaceMock).toHaveBeenCalledWith('contract', {
      contractId: contract.id,
    })
  })
  it('does submit negative rating and navigates to yourTrades', async () => {
    useSettingsStore.getState().setShowBackupReminder(false)
    createUserRatingMock.mockReturnValueOnce(negativeRating)
    const { result } = renderHook(useRateSetup, { initialProps: { ...initialProps, vote: 'negative' } })
    await act(async () => {
      await result.current.rate()
    })
    expect(replaceMock).toHaveBeenCalledWith('yourTrades')
  })
  it('handles rating submit error', async () => {
    createUserRatingMock.mockReturnValueOnce(negativeRating)
    rateUserMock.mockResolvedValueOnce([null, unauthorizedError])
    const { result } = renderHook(useRateSetup, { initialProps: { ...initialProps, vote: 'negative' } })
    await act(async () => {
      await result.current.rate()
    })
    expect(showErrorBannerMock).toHaveBeenCalled()
    expect(replaceMock).not.toHaveBeenCalled()
  })
  it('opens trade breakdown poup', () => {
    const { result } = renderHook(useRateSetup, { initialProps })
    result.current.showTradeBreakdown()
    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      action2: {
        callback: result.current.viewInExplorer,
        icon: 'externalLink',
        label: 'view in explorer',
      },
      content: <TradeBreakdown {...contract} />,
      level: 'APP',
      title: 'trade breakdown',
      visible: true,
    })
  })
  it('opens tx in explorer', () => {
    const contractWithTxId = { ...contract, releaseTxId: 'releaseTxId' }
    const { result } = renderHook(useRateSetup, { initialProps: { ...initialProps, contract: contractWithTxId } })
    result.current.viewInExplorer()
    expect(showTransactionMock).toHaveBeenCalledWith(contractWithTxId.releaseTxId, 'regtest')
  })
  it('opens escrow address in explorer if txId is not known', () => {
    const { result } = renderHook(useRateSetup, { initialProps })
    result.current.viewInExplorer()
    expect(showAddressMock).toHaveBeenCalledWith(contract.escrow, 'regtest')
  })
})
