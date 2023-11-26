import analytics from '@react-native-firebase/analytics'
import { responseUtils } from 'test-utils'
import { recoveredAccount } from '../../../tests/unit/data/accountData'
import { buyOffer, sellOffer } from '../../../tests/unit/data/offerData'
import { unauthorizedError } from '../../../tests/unit/data/peachAPIData'
import { useSettingsStore } from '../../store/settingsStore'
import { error } from '../log'
import { peachAPI } from '../peachAPI'
import { recoverAccount } from './recoverAccount'

const userUpdateMock = jest.fn()
jest.mock('../../init/userUpdate', () => ({
  userUpdate: () => userUpdateMock(),
}))
const getOffersMock = jest.spyOn(peachAPI.private.offer, 'getOffers')

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
    const offers = [{ ...buyOffer, message: '' }, sellOffer]
    getOffersMock.mockResolvedValueOnce({ result: offers, ...responseUtils })
    const recovered = await recoverAccount(recoveredAccount)
    expect(recovered?.offers).toEqual(offers)
  })
  it('logs event account_restored', async () => {
    await recoverAccount(recoveredAccount)
    expect(analytics().logEvent).toHaveBeenCalledWith('account_restored')
  })
  it('handles api errors for offers', async () => {
    getOffersMock.mockResolvedValueOnce({ error: { error: 'UNAUTHORIZED' }, ...responseUtils })

    await recoverAccount(recoveredAccount)
    expect(error).toHaveBeenCalledWith('Error', unauthorizedError)
  })
})
