import { renderHook } from '@testing-library/react-native'
import { account1 } from '../../../../tests/unit/data/accountData'
import { contract } from '../../../../tests/unit/data/contractData'
import { TradeBreakdown } from '../../../overlays/TradeBreakdown'
import { Props, useRateSetup } from './useRateSetup'
import { apiSuccess, unauthorizedError } from '../../../../tests/unit/data/peachAPIData'

const replaceMock = jest.fn()
const useNavigationMock = jest.fn().mockReturnValue({
  replace: (...args: any[]) => replaceMock(...args),
})
jest.mock('../../../hooks/useNavigation', () => ({
  useNavigation: () => useNavigationMock(),
}))

const showErrorBannerMock = jest.fn()
const useShowErrorBannerMock = jest.fn().mockReturnValue(showErrorBannerMock)
jest.mock('../../../hooks/useShowErrorBanner', () => ({
  useShowErrorBanner: () => useShowErrorBannerMock(),
}))

const updateOverlayMock = jest.fn()
const useOverlayContextMock = jest.fn().mockReturnValue([, updateOverlayMock])
jest.mock('../../../contexts/overlay', () => ({
  useOverlayContext: () => useOverlayContextMock(),
}))

const rateUserMock = jest.fn().mockResolvedValue([apiSuccess, null])
jest.mock('../../../utils/peachAPI', () => ({
  rateUser: (...args: any[]) => rateUserMock(...args),
}))

const createUserRatingMock = jest.fn()
jest.mock('../../../utils/contract', () => ({
  createUserRating: (...args: any[]) => createUserRatingMock(...args),
}))

const useSettingsStoreMock = jest.fn((selector) => selector({ showBackupReminder: true }))
jest.mock('../../../store/settingsStore', () => ({
  useSettingsStore: (selector: any) => useSettingsStoreMock(selector),
}))

const showTransactionMock = jest.fn()
const showAddressMock = jest.fn()
jest.mock('../../../utils/bitcoin', () => ({
  showTransaction: (...args: any[]) => showTransactionMock(...args),
  showAddress: (...args: any[]) => showAddressMock(...args),
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

  afterEach(() => {
    jest.clearAllMocks()
  })
  it('returns default values correctly', () => {
    const { result } = renderHook(useRateSetup, {
      initialProps,
    })

    expect(result.current).toEqual({
      rate: expect.any(Function),
      showTradeBreakdown: expect.any(Function),
      viewInExplorer: expect.any(Function),
    })
  })
  it('does not submit rating if none has been set', () => {
    const { result } = renderHook(useRateSetup, {
      initialProps,
    })
    result.current.rate()
    expect(rateUserMock).not.toHaveBeenCalled()
  })
  it('does submit rating as buyer', async () => {
    createUserRatingMock.mockReturnValueOnce(positiveRating)
    const { result } = renderHook(useRateSetup, {
      initialProps: { ...initialProps, vote: 'positive', view: 'buyer' },
    })
    await result.current.rate()
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
    const { result } = renderHook(useRateSetup, {
      initialProps: { ...initialProps, vote: 'positive', view: 'seller' },
    })
    await result.current.rate()
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
    createUserRatingMock.mockReturnValueOnce(positiveRating)
    const { result } = renderHook(useRateSetup, {
      initialProps: { ...initialProps, vote: 'positive' },
    })
    await result.current.rate()
    expect(rateUserMock).toHaveBeenCalledWith({
      contractId: contract.id,
      rating: positiveRating.rating,
      signature: positiveRating.signature,
    })
    expect(replaceMock).toHaveBeenCalledWith('backupTime', {
      view: initialProps.view,
      nextScreen: 'contract',
      contractId: contract.id,
    })
  })
  it('does submit negative rating and navigates to backupTime', async () => {
    createUserRatingMock.mockReturnValueOnce(negativeRating)
    const { result } = renderHook(useRateSetup, {
      initialProps: { ...initialProps, vote: 'negative' },
    })
    await result.current.rate()
    expect(rateUserMock).toHaveBeenCalledWith({
      contractId: contract.id,
      rating: negativeRating.rating,
      signature: negativeRating.signature,
    })
    expect(replaceMock).toHaveBeenCalledWith('backupTime', {
      view: initialProps.view,
      nextScreen: 'yourTrades',
    })
  })
  it('does submit positive rating and navigates back to contract', async () => {
    useSettingsStoreMock.mockImplementationOnce((selector) => selector({ showBackupReminder: false }))
    createUserRatingMock.mockReturnValueOnce(positiveRating)
    const { result } = renderHook(useRateSetup, {
      initialProps: { ...initialProps, vote: 'positive' },
    })
    await result.current.rate()
    expect(replaceMock).toHaveBeenCalledWith('contract', {
      contractId: contract.id,
    })
  })
  it('does submit negative rating and navigates to yourTrades', async () => {
    useSettingsStoreMock.mockImplementationOnce((selector) => selector({ showBackupReminder: false }))
    createUserRatingMock.mockReturnValueOnce(negativeRating)
    const { result } = renderHook(useRateSetup, {
      initialProps: { ...initialProps, vote: 'negative' },
    })
    await result.current.rate()
    expect(replaceMock).toHaveBeenCalledWith('yourTrades')
  })
  it('handles rating submit error', async () => {
    createUserRatingMock.mockReturnValueOnce(negativeRating)
    rateUserMock.mockResolvedValueOnce([null, unauthorizedError])
    const { result } = renderHook(useRateSetup, {
      initialProps: { ...initialProps, vote: 'negative' },
    })
    await result.current.rate()
    expect(showErrorBannerMock).toHaveBeenCalled()
    expect(replaceMock).not.toHaveBeenCalled()
  })
  it('opens trade breakdown poup', () => {
    const { result } = renderHook(useRateSetup, {
      initialProps,
    })
    result.current.showTradeBreakdown()
    expect(updateOverlayMock).toHaveBeenCalledWith({
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
    const { result } = renderHook(useRateSetup, {
      initialProps: { ...initialProps, contract: contractWithTxId },
    })
    result.current.viewInExplorer()
    expect(showTransactionMock).toHaveBeenCalledWith(contractWithTxId.releaseTxId, 'regtest')
  })
  it('opens escrow address in explorer if txId is not known', () => {
    const { result } = renderHook(useRateSetup, {
      initialProps,
    })
    result.current.viewInExplorer()
    expect(showAddressMock).toHaveBeenCalledWith(contract.escrow, 'regtest')
  })
})
