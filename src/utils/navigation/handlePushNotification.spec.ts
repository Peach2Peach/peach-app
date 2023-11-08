/* eslint-disable max-lines-per-function */
import { FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import { contract } from '../../../tests/unit/data/contractData'
import { sellOffer } from '../../../tests/unit/data/offerData'
import { handlePushNotification } from './handlePushNotification'

const getContractMock = jest.fn()
const getOfferDetailsMock = jest.fn()
jest.mock('../peachAPI', () => ({
  getOfferDetails: (...args: unknown[]) => getOfferDetailsMock(...args),
  getContract: (...args: unknown[]) => getContractMock(...args),
}))

describe('handlePushNotification', () => {
  const navigationRef: any = {
    navigate: jest.fn(),
  }

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('navigates to contract when shouldGoToContract is true', async () => {
    const remoteMessage = {
      data: {
        type: 'contract.paymentMade',
        contractId: '1',
        sentTime: 1231006505000,
      },
    } as FirebaseMessagingTypes.RemoteMessage & { data: any }

    getContractMock.mockResolvedValue([contract])
    await handlePushNotification(navigationRef, remoteMessage)

    expect(navigationRef.navigate).toHaveBeenCalledWith('contract', {
      contract: {
        ...contract,
        paymentMade: new Date(1231006505000),
      },
      contractId: '1',
    })
  })

  it('navigates to contract when shouldGoToContract is true and no contract is locally defined', async () => {
    const remoteMessage = {
      data: {
        type: 'contract.paymentMade',
        contractId: '1',
        sentTime: 1231006505000,
      },
    } as FirebaseMessagingTypes.RemoteMessage & { data: any }

    getContractMock.mockResolvedValue([null])
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
    } as FirebaseMessagingTypes.RemoteMessage & { data: any }

    getContractMock.mockResolvedValue([contract])
    await handlePushNotification(navigationRef, remoteMessage)

    expect(navigationRef.navigate).toHaveBeenCalledWith('contract', {
      contract: {
        ...contract,
        paymentMade: expect.any(Date),
      },
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
    } as FirebaseMessagingTypes.RemoteMessage & { data: any }

    await handlePushNotification(navigationRef, remoteMessage)

    expect(navigationRef.navigate).toHaveBeenCalledWith('contractChat', { contractId: '1' })
  })

  it('navigates to yourTrades sell when shouldGoToYourTradesSell is true', async () => {
    const remoteMessage = {
      data: { offerId: sellOffer.id, type: 'offer.sellOfferExpired' },
    } as FirebaseMessagingTypes.RemoteMessage & {
      data: any
    }

    await handlePushNotification(navigationRef, remoteMessage)

    expect(navigationRef.navigate).toHaveBeenCalledWith('yourTrades', { tab: 'yourTrades.sell' })
  })

  it('navigates to sell when shouldGoToSell is true', async () => {
    const remoteMessage = {
      data: { offerId: sellOffer.id, type: 'offer.notFunded' },
    } as FirebaseMessagingTypes.RemoteMessage & {
      data: any
    }
    await handlePushNotification(navigationRef, remoteMessage)

    expect(navigationRef.navigate).toHaveBeenCalledWith('sell')
  })

  it('navigates to search when shouldGoToSearch is true and offer is defined', async () => {
    getOfferDetailsMock.mockResolvedValue([
      {
        ...sellOffer,
        matches: ['2'],
      },
      null,
    ])

    const remoteMessage = {
      data: {
        type: 'offer.matchSeller',
        offerId: sellOffer.id,
      },
    } as FirebaseMessagingTypes.RemoteMessage & { data: any }

    await handlePushNotification(navigationRef, remoteMessage)

    expect(navigationRef.navigate).toHaveBeenCalledWith('search', { offerId: sellOffer.id })
  })

  it('navigates to offerPublished when shouldGoToOfferPublished is true and offerId is defined', async () => {
    getOfferDetailsMock.mockResolvedValue([sellOffer, null])
    const remoteMessage = {
      data: {
        type: 'offer.escrowFunded',
        offerId: sellOffer.id,
      },
    } as FirebaseMessagingTypes.RemoteMessage & { data: any }

    await handlePushNotification(navigationRef, remoteMessage)

    expect(navigationRef.navigate).toHaveBeenCalledWith('offerPublished', {
      offerId: sellOffer.id,
      isSellOffer: true,
      shouldGoBack: true,
    })
  })

  it('navigates to offer when offerId is defined', async () => {
    getOfferDetailsMock.mockResolvedValue([sellOffer, null])
    const remoteMessage = {
      data: {
        type: 'offer.canceled',
        offerId: sellOffer.id,
      },
    } as FirebaseMessagingTypes.RemoteMessage & { data: any }

    await handlePushNotification(navigationRef, remoteMessage)

    expect(navigationRef.navigate).toHaveBeenCalledWith('offer', { offerId: sellOffer.id })
  })

  it('should do nothing and return false in any other case', async () => {
    getOfferDetailsMock.mockResolvedValue([sellOffer, null])
    const remoteMessage = {
      data: { type: 'unhandled.messageType' },
    } as FirebaseMessagingTypes.RemoteMessage & { data: any }

    const result = await handlePushNotification(navigationRef, remoteMessage)
    expect(result).toEqual(false)
  })
  it('navigates to newBadges when badges are defined on the PN', async () => {
    const badges = 'fastTrader'

    const remoteMessage = {
      data: {
        type: 'contract.paymentMade',
        badges,
        sentTime: 1231006505000,
      },
    } as FirebaseMessagingTypes.RemoteMessage & { data: any }

    await handlePushNotification(navigationRef, remoteMessage)

    expect(navigationRef.navigate).toHaveBeenCalledWith('newBadge', {
      badges,
    })
  })
})
