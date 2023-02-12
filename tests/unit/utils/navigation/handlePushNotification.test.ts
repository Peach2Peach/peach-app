/* eslint-disable max-lines-per-function */
import { FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import { getContract } from '../../../../src/utils/contract'
import { handlePushNotification } from '../../../../src/utils/navigation'
import { contract } from '../../data/contractData'
import { sellOffer } from '../../data/offerData'

jest.mock('../../../../src/utils/contract', () => ({
  getContract: jest.fn(),
}))
describe('handlePushNotification', () => {
  const getOfferDetailsMock = jest.fn()
  jest.mock('../../../../src/utils/peachAPI', () => ({
    getOfferDetails: getOfferDetailsMock,
  }))

  const navigationRef: any = {
    navigate: jest.fn(),
  }

  afterAll(() => {
    jest.resetAllMocks()
  })

  it('navigates to contract when shouldGoToContract is true', async () => {
    const remoteMessage = {
      messageType: 'contract.paymentMade',
      data: {
        contractId: '1',
        sentTime: 1231006505000,
      },
    } as FirebaseMessagingTypes.RemoteMessage & { data: any }

    ;(getContract as jest.Mock).mockReturnValue(contract)
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
      messageType: 'contract.paymentMade',
      data: {
        contractId: '1',
        sentTime: 1231006505000,
      },
    } as FirebaseMessagingTypes.RemoteMessage & { data: any }

    ;(getContract as jest.Mock).mockReturnValue(null)
    await handlePushNotification(navigationRef, remoteMessage)

    expect(navigationRef.navigate).toHaveBeenCalledWith('contract', {
      contract: undefined,
      contractId: '1',
    })
  })

  it('navigates to contract and set payment made date to now if no sentTime is defined', async () => {
    const remoteMessage = {
      messageType: 'contract.paymentMade',
      data: {
        contractId: '1',
      },
    } as FirebaseMessagingTypes.RemoteMessage & { data: any }

    ;(getContract as jest.Mock).mockReturnValue(contract)
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
      messageType: 'contract.chat',
      data: {
        contractId: '1',
        isChat: 'true',
      },
    } as FirebaseMessagingTypes.RemoteMessage & { data: any }

    await handlePushNotification(navigationRef, remoteMessage)

    expect(navigationRef.navigate).toHaveBeenCalledWith('contractChat', { contractId: '1' })
  })

  it('navigates to yourTrades sell when shouldGoToYourTradesSell is true', async () => {
    const remoteMessage = {
      messageType: 'offer.sellOfferExpired',
      data: { offerId: sellOffer.id },
    } as FirebaseMessagingTypes.RemoteMessage & {
      data: any
    }

    await handlePushNotification(navigationRef, remoteMessage)

    expect(navigationRef.navigate).toHaveBeenCalledWith('yourTrades', { tab: 'sell' })
  })

  it('navigates to sell when shouldGoToSell is true', async () => {
    const remoteMessage = {
      messageType: 'offer.notFunded',
      data: { offerId: sellOffer.id },
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
    ])

    const remoteMessage = {
      messageType: 'offer.matchSeller',
      data: {
        offerId: sellOffer.id,
      },
    } as FirebaseMessagingTypes.RemoteMessage & { data: any }

    await handlePushNotification(navigationRef, remoteMessage)

    expect(navigationRef.navigate).toHaveBeenCalledWith('search', { offerId: sellOffer.id })
  })

  it('navigates to offerPublished when shouldGoToOfferPublished is true and offerId is defined', async () => {
    getOfferDetailsMock.mockResolvedValue([sellOffer])
    const remoteMessage = {
      messageType: 'offer.escrowFunded',
      data: {
        offerId: sellOffer.id,
      },
    } as FirebaseMessagingTypes.RemoteMessage & { data: any }

    await handlePushNotification(navigationRef, remoteMessage)

    expect(navigationRef.navigate).toHaveBeenCalledWith('offerPublished', { offerId: sellOffer.id })
  })

  it('navigates to offer when offerId is defined', async () => {
    getOfferDetailsMock.mockResolvedValue([sellOffer])
    const remoteMessage = {
      messageType: 'offer.canceled',
      data: {
        offerId: sellOffer.id,
      },
    } as FirebaseMessagingTypes.RemoteMessage & { data: any }

    await handlePushNotification(navigationRef, remoteMessage)

    expect(navigationRef.navigate).toHaveBeenCalledWith('offerPublished', { offerId: sellOffer.id })
  })

  it('should do nothing and return false in any other case', async () => {
    getOfferDetailsMock.mockResolvedValue([sellOffer])
    const remoteMessage = {
      messageType: 'unhandled.messageType',
      data: {},
    } as FirebaseMessagingTypes.RemoteMessage & { data: any }

    await handlePushNotification(navigationRef, remoteMessage)

    expect(navigationRef.navigate).toHaveBeenCalledWith('offerPublished', { offerId: sellOffer.id })
  })
})
