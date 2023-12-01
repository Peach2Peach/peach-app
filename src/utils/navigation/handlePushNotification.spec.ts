/* eslint-disable max-lines-per-function */
import { FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import { contract } from '../../../tests/unit/data/contractData'
import { sellOffer } from '../../../tests/unit/data/offerData'
import { responseUtils } from '../../../tests/unit/helpers/test-utils'
import { peachAPI } from '../peachAPI'
import { Navigation, handlePushNotification } from './handlePushNotification'

type MessageWithData = FirebaseMessagingTypes.RemoteMessage & { data: object }

const getContractMock = jest.spyOn(peachAPI.private.contract, 'getContract')
const getOfferDetailsMock = jest.spyOn(peachAPI.private.offer, 'getOfferDetails')

const timestamp = 1231006505000
describe('handlePushNotification', () => {
  // @ts-expect-error mock only needs one method here
  const navigationRef: Navigation = { navigate: jest.fn() }

  it('navigates to contract when shouldGoToContract is true', async () => {
    const remoteMessage = {
      data: {
        type: 'contract.paymentMade',
        contractId: '1',
        sentTime: timestamp,
      },
    } as MessageWithData

    await handlePushNotification(navigationRef, remoteMessage)

    expect(navigationRef.navigate).toHaveBeenCalledWith('contract', {
      contract: {
        ...contract,
        paymentMade: new Date(timestamp),
      },
      contractId: '1',
    })
  })

  it('navigates to contract when shouldGoToContract is true and no contract is locally defined', async () => {
    const remoteMessage = {
      data: {
        type: 'contract.paymentMade',
        contractId: '1',
        sentTime: timestamp,
      },
    } as MessageWithData

    getContractMock.mockResolvedValueOnce(responseUtils)
    await handlePushNotification(navigationRef, remoteMessage)

    expect(navigationRef.navigate).toHaveBeenCalledWith('contract', {
      contract: undefined,
      contractId: '1',
    })
  })

  it('navigates to contract and set payment made date to now if no sentTime is defined', async () => {
    const remoteMessage = {
      data: {
        type: 'contract.paymentMade',
        contractId: '1',
      },
    } as MessageWithData

    await handlePushNotification(navigationRef, remoteMessage)

    expect(navigationRef.navigate).toHaveBeenCalledWith('contract', {
      contract: { ...contract, paymentMade: expect.any(Date) },
      contractId: '1',
    })
  })

  it('navigates to contract chat when shouldGoToContractChat is true', async () => {
    const remoteMessage = {
      data: {
        type: 'contract.chat',
        contractId: '1',
        isChat: 'true',
      },
    } as MessageWithData

    await handlePushNotification(navigationRef, remoteMessage)

    expect(navigationRef.navigate).toHaveBeenCalledWith('contractChat', { contractId: '1' })
  })

  it('navigates to yourTrades sell when shouldGoToYourTradesSell is true', async () => {
    const remoteMessage = {
      data: { offerId: sellOffer.id, type: 'offer.sellOfferExpired' },
    } as MessageWithData

    await handlePushNotification(navigationRef, remoteMessage)

    expect(navigationRef.navigate).toHaveBeenCalledWith('homeScreen', {
      screen: 'yourTrades',
      params: { tab: 'yourTrades.sell' },
    })
  })

  it('navigates to yourTrades buy when shouldGoToYourTradesBuy is true', async () => {
    const remoteMessage = {
      data: { offerId: sellOffer.id, type: 'offer.buyOfferExpired' },
    } as MessageWithData

    await handlePushNotification(navigationRef, remoteMessage)

    expect(navigationRef.navigate).toHaveBeenCalledWith('homeScreen', {
      screen: 'yourTrades',
      params: { tab: 'yourTrades.buy' },
    })
  })

  it('navigates to sell when shouldGoToSell is true', async () => {
    const remoteMessage = {
      data: { offerId: sellOffer.id, type: 'offer.notFunded' },
    } as MessageWithData
    await handlePushNotification(navigationRef, remoteMessage)

    expect(navigationRef.navigate).toHaveBeenCalledWith('homeScreen', {
      screen: 'sell',
    })
  })

  it('navigates to search when shouldGoToSearch is true and offer is defined', async () => {
    getOfferDetailsMock.mockResolvedValueOnce({ result: { ...sellOffer, matches: ['2'] }, ...responseUtils })

    const remoteMessage = {
      data: {
        type: 'offer.matchSeller',
        offerId: sellOffer.id,
      },
    } as MessageWithData

    await handlePushNotification(navigationRef, remoteMessage)

    expect(navigationRef.navigate).toHaveBeenCalledWith('search', { offerId: sellOffer.id })
  })

  it('navigates to offerPublished when shouldGoToOfferPublished is true and offerId is defined', async () => {
    const remoteMessage = {
      data: {
        type: 'offer.escrowFunded',
        offerId: sellOffer.id,
      },
    } as MessageWithData

    await handlePushNotification(navigationRef, remoteMessage)

    expect(navigationRef.navigate).toHaveBeenCalledWith('offerPublished', {
      offerId: sellOffer.id,
      shouldGoBack: true,
    })
  })

  it('navigates to offer when offerId is defined', async () => {
    const remoteMessage = {
      data: {
        type: 'offer.canceled',
        offerId: sellOffer.id,
      },
    } as MessageWithData

    await handlePushNotification(navigationRef, remoteMessage)

    expect(navigationRef.navigate).toHaveBeenCalledWith('offer', { offerId: sellOffer.id })
  })

  it('should do nothing and return false in unknown other case', async () => {
    const remoteMessage = {
      data: { type: 'unhandled.messageType' },
    } as MessageWithData

    const result = await handlePushNotification(navigationRef, remoteMessage)
    expect(result).toEqual(false)
  })
  it('navigates to newBadges when badges are defined on the PN', async () => {
    const badges = 'fastTrader'

    const remoteMessage = {
      data: {
        type: 'contract.paymentMade',
        badges,
        sentTime: timestamp,
      },
    } as MessageWithData

    await handlePushNotification(navigationRef, remoteMessage)

    expect(navigationRef.navigate).toHaveBeenCalledWith('newBadge', { badges })
  })
})
