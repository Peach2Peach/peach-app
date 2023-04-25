import analytics from '@react-native-firebase/analytics'
import { recoverAccount } from '.'
import { recoveredAccount } from '../../../tests/unit/data/accountData'
import { contract } from '../../../tests/unit/data/contractData'
import { buyOffer, sellOffer } from '../../../tests/unit/data/offerData'
import { settingsStore } from '../../store/settingsStore'
import { error } from '../log'

const apiError = { error: 'UNAUTHORIZED' }
const userUpdateMock = jest.fn()
jest.mock('../../init/userUpdate', () => ({
  userUpdate: () => userUpdateMock(),
}))
const getContractsMock = jest.fn().mockResolvedValue([[], null])
const getOffersMock = jest.fn().mockResolvedValue([[], null])
jest.mock('../peachAPI', () => ({
  getContracts: (...args: any[]) => getContractsMock(...args),
  getOffers: (...args: any[]) => getOffersMock(...args),
}))

describe('recoverAccount', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('resets fcm token', async () => {
    settingsStore.getState().setFCMToken('existingFCMToken')
    await recoverAccount(recoveredAccount)
    expect(settingsStore.getState().fcmToken).toBe('')
  })
  it('resets pgp published', async () => {
    settingsStore.getState().setPGPPublished(true)
    await recoverAccount(recoveredAccount)
    expect(settingsStore.getState().pgpPublished).toBeFalsy()
  })
  it('calls user update', async () => {
    await recoverAccount(recoveredAccount)
    expect(userUpdateMock).toHaveBeenCalled()
  })
  it('gets offers and stores them', async () => {
    const offers = [buyOffer, sellOffer]
    getOffersMock.mockReturnValueOnce([offers, null])
    const recovered = await recoverAccount(recoveredAccount)
    expect(recovered?.offers).toEqual(offers)
    expect(recoveredAccount.offers).toEqual(offers)
  })
  it('gets contracts and stores them', async () => {
    const contracts = [contract]
    getContractsMock.mockReturnValueOnce([contracts, null])
    const recovered = await recoverAccount(recoveredAccount)
    expect(recovered?.contracts).toEqual(contracts)
    expect(recoveredAccount.contracts).toEqual(contracts)
  })
  it('logs event account_restored', async () => {
    await recoverAccount(recoveredAccount)
    expect(analytics().logEvent).toHaveBeenCalledWith('account_restored')
  })
  it('handles api errors for offers', async () => {
    getOffersMock.mockReturnValueOnce([null, apiError])

    await recoverAccount(recoveredAccount)
    expect(error).toHaveBeenCalledWith('Error', apiError)
  })
  it('handles api errors for contracts', async () => {
    getContractsMock.mockReturnValueOnce([null, apiError])

    await recoverAccount(recoveredAccount)
    expect(error).toHaveBeenCalledWith('Error', apiError)
  })
})
