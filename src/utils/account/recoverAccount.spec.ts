import analytics from '@react-native-firebase/analytics'
import { recoverAccount } from '.'
import { recoveredAccount } from '../../../tests/unit/data/accountData'
import { buyOffer, sellOffer } from '../../../tests/unit/data/offerData'
import { unauthorizedError } from '../../../tests/unit/data/peachAPIData'
import { useSettingsStore } from '../../store/settingsStore'
import { error } from '../log'

const userUpdateMock = jest.fn()
jest.mock('../../init/userUpdate', () => ({
  userUpdate: () => userUpdateMock(),
}))
const getContractsMock = jest.fn().mockResolvedValue([[], null])
const getOffersMock = jest.fn().mockResolvedValue([[], null])
jest.mock('../peachAPI', () => ({
  getContracts: (...args: unknown[]) => getContractsMock(...args),
  getOffers: (...args: unknown[]) => getOffersMock(...args),
}))

describe('recoverAccount', () => {
  it('resets fcm token', async () => {
    useSettingsStore.getState().setFCMToken('existingFCMToken')
    await recoverAccount(recoveredAccount)
    expect(useSettingsStore.getState().fcmToken).toBe('')
  })
  it('resets pgp published', async () => {
    useSettingsStore.getState().setPGPPublished(true)
    await recoverAccount(recoveredAccount)
    expect(useSettingsStore.getState().pgpPublished).toBeFalsy()
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
  it('logs event account_restored', async () => {
    await recoverAccount(recoveredAccount)
    expect(analytics().logEvent).toHaveBeenCalledWith('account_restored')
  })
  it('handles api errors for offers', async () => {
    getOffersMock.mockReturnValueOnce([null, unauthorizedError])

    await recoverAccount(recoveredAccount)
    expect(error).toHaveBeenCalledWith('Error', unauthorizedError)
  })
  it('handles api errors for contracts', async () => {
    getContractsMock.mockReturnValueOnce([null, unauthorizedError])

    await recoverAccount(recoveredAccount)
    expect(error).toHaveBeenCalledWith('Error', unauthorizedError)
  })
})
