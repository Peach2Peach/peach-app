import { act, render, renderHook, responseUtils } from 'test-utils'
import { contract } from '../../../../peach-api/src/testData/contract'
import { account1 } from '../../../../tests/unit/data/accountData'
import { navigateMock, replaceMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { useSettingsStore } from '../../../store/settingsStore'
import { usePopupStore } from '../../../store/usePopupStore'
import { peachAPI } from '../../../utils/peachAPI'
import { useRateSetup } from './useRateSetup'

const showErrorBannerMock = jest.fn()
jest.mock('../../../hooks/useShowErrorBanner', () => ({
  useShowErrorBanner: () => showErrorBannerMock,
}))

const rateUserMock = jest.spyOn(peachAPI.private.contract, 'rateUser')

const createUserRatingMock = jest.fn()
jest.mock('../../../utils/contract', () => ({
  createUserRating: (...args: unknown[]) => createUserRatingMock(...args),
}))

const showTransactionMock = jest.fn()
const showAddressMock = jest.fn()
const getTradeBreakdownMock = jest.fn((..._args: unknown[]) => ({
  totalAmount: 21000,
  peachFee: 21,
  networkFee: 210,
  amountReceived: 20769,
}))
jest.mock('../../../utils/bitcoin', () => ({
  showTransaction: (...args: unknown[]) => showTransactionMock(...args),
  showAddress: (...args: unknown[]) => showAddressMock(...args),
  getTradeBreakdown: (...args: unknown[]) => getTradeBreakdownMock(...args),
}))

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
  const initialProps = { contract, view: 'buyer', vote: undefined, saveAndUpdate: saveAndUpdateMock } as const

  beforeEach(() => {
    useSettingsStore.getState().reset()
    useSettingsStore.getState().setShowBackupReminder(false)
  })
  it('returns default values correctly', () => {
    const { result } = renderHook(useRateSetup, { initialProps })

    expect(result.current).toEqual({
      rate: expect.any(Function),
      showTradeBreakdown: expect.any(Function),
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
      contractId: contract.id,
      nextScreen: 'contract',
    })
  })
  it('does submit positive rating and navigates back to contract', async () => {
    useSettingsStore.getState().setShowBackupReminder(false)
    createUserRatingMock.mockReturnValueOnce(positiveRating)
    const { result } = renderHook(useRateSetup, { initialProps: { ...initialProps, vote: 'positive' } })
    await act(async () => {
      await result.current.rate()
    })
    expect(navigateMock).toHaveBeenCalledWith('contract', {
      contractId: contract.id,
    })
  })
  it('does submit negative rating and navigates back to contract', async () => {
    useSettingsStore.getState().setShowBackupReminder(false)
    createUserRatingMock.mockReturnValueOnce(negativeRating)
    const { result } = renderHook(useRateSetup, { initialProps: { ...initialProps, vote: 'negative' } })
    await act(async () => {
      await result.current.rate()
    })
    expect(navigateMock).toHaveBeenCalledWith('contract', {
      contractId: contract.id,
    })
  })
  it('handles rating submit error', async () => {
    createUserRatingMock.mockReturnValueOnce(negativeRating)
    rateUserMock.mockResolvedValueOnce({ error: { error: 'UNAUTHORIZED' }, ...responseUtils })
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
    const popupComponent = usePopupStore.getState().popupComponent || <></>

    expect(render(popupComponent)).toMatchSnapshot()
    expect(getTradeBreakdownMock).toHaveBeenCalled()
  })
})
