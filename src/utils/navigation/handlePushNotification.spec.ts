/* eslint-disable max-lines-per-function */
import { FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import { handlePushNotification } from '.'
import { getOfferDetails } from '../peachAPI'
import { contract } from '../../../tests/unit/data/contractData'
import { sellOffer } from '../../../tests/unit/data/offerData'
import { contractStore } from '../../store/contractStore'

describe('handlePushNotification', () => {
  const navigationRef: any = {
    navigate: jest.fn(),
  }

  afterEach(() => {
    contractStore.getState().reset()
    jest.resetAllMocks()
  })

  it('navigates to contract when shouldGoToContract is true', async () => {
    const remoteMessage = {
      data: {
        type: 'contract.paymentMade',
        contractId: contract.id,
        sentTime: 1231006505000,
      },
    } as FirebaseMessagingTypes.RemoteMessage & { data: any }

    contractStore.getState().setContract(contract)
    await handlePushNotification(navigationRef, remoteMessage)

    expect(navigationRef.navigate).toHaveBeenCalledWith('contract', {
      contract: {
        ...contract,
        paymentMade: new Date(1231006505000),
      },
      contractId: contract.id,
    })
  })

  it('navigates to contract when shouldGoToContract is true and no contract is locally defined', async () => {
    const remoteMessage = {
      data: {
        type: 'contract.paymentMade',
        contractId: contract.id,
        sentTime: 1231006505000,
      },
    } as FirebaseMessagingTypes.RemoteMessage & { data: any }

    await handlePushNotification(navigationRef, remoteMessage)

    expect(navigationRef.navigate).toHaveBeenCalledWith('contract', {
      contract: undefined,
      contractId: contract.id,
    })
  })

  it('navigates to contract and set payment made date to now if no sentTime is defined', async () => {
    const remoteMessage = {
      data: {
        type: 'contract.paymentMade',
        contractId: contract.id,
      },
    } as FirebaseMessagingTypes.RemoteMessage & { data: any }

    contractStore.getState().setContract(contract)
    await handlePushNotification(navigationRef, remoteMessage)

    expect(navigationRef.navigate).toHaveBeenCalledWith('contract', {
      contract: {
        ...contract,
        paymentMade: expect.any(Date),
      },
      contractId: contract.id,
    })
  })

  it('navigates to contract chat when shouldGoToContractChat is true', async () => {
    const remoteMessage = {
      data: {
        type: 'contract.chat',
        contractId: contract.id,
        isChat: 'true',
      },
    } as FirebaseMessagingTypes.RemoteMessage & { data: any }

    await handlePushNotification(navigationRef, remoteMessage)

    expect(navigationRef.navigate).toHaveBeenCalledWith('contractChat', { contractId: contract.id })
  })

  it('navigates to yourTrades sell when shouldGoToYourTradesSell is true', async () => {
    const remoteMessage = {
      data: { offerId: sellOffer.id, type: 'offer.sellOfferExpired' },
    } as FirebaseMessagingTypes.RemoteMessage & {
      data: any
    }

    await handlePushNotification(navigationRef, remoteMessage)

    expect(navigationRef.navigate).toHaveBeenCalledWith('yourTrades', { tab: 'sell' })
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
    ;(getOfferDetails as jest.Mock).mockResolvedValue([
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
    ;(getOfferDetails as jest.Mock).mockResolvedValue([sellOffer, null])
    const remoteMessage = {
      data: {
        type: 'offer.escrowFunded',
        offerId: sellOffer.id,
      },
    } as FirebaseMessagingTypes.RemoteMessage & { data: any }

    await handlePushNotification(navigationRef, remoteMessage)

    expect(navigationRef.navigate).toHaveBeenCalledWith('offerPublished', { isSellOffer: true })
  })

  it('navigates to offer when offerId is defined', async () => {
    ;(getOfferDetails as jest.Mock).mockResolvedValue([sellOffer, null])
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
    ;(getOfferDetails as jest.Mock).mockResolvedValue([sellOffer, null])
    const remoteMessage = {
      data: { type: 'unhandled.messageType' },
    } as FirebaseMessagingTypes.RemoteMessage & { data: any }

    const result = await handlePushNotification(navigationRef, remoteMessage)
    expect(result).toEqual(false)
  })
})
