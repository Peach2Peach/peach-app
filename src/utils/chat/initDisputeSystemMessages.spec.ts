/* eslint-disable max-lines-per-function */
import i18n from '../i18n'
import { initDisputeSystemMessages } from './initDisputeSystemMessages'

describe('initDisputeSystemMessages', () => {
  const now = new Date()
  const roomId = 'room-id'
  const mediatorWillJoinMessage: Message = {
    date: now,
    from: 'system',
    message: i18n('chat.systemMessage.mediatorWillJoinSoon'),
    readBy: [''],
    roomId,
    signature: expect.any(String),
  }
  const provideMoreInformationMessage: Message = {
    date: now,
    from: 'system',
    message: [
      i18n('chat.systemMessage.provideMoreInformation.1'),
      i18n('chat.systemMessage.provideMoreInformation.2', 'PC-7B-1C8'),
    ].join('\n\n'),
    readBy: [''],
    roomId,
    signature: expect.any(String),
  }
  it('creates a system message for started disputes when buyer raises it', () => {
    const initiator = 'buyer'
    const initiatorId = 'buyerId'
    const reason = i18n('dispute.reason.other')
    const contract: Partial<Contract> = {
      id: '123-456',
      disputeDate: now,
      disputeInitiator: initiatorId,
      seller: {
        id: 'sellerId',
      } as User,
      disputeReason: 'other',
    }
    expect(initDisputeSystemMessages(roomId, contract as Contract)).toEqual([
      {
        date: now,
        from: 'system',
        message: i18n('chat.systemMessage.disputeStarted', initiator, 'PeachbuyerId', reason),
        readBy: [''],
        roomId,
        signature: expect.any(String),
      },
      mediatorWillJoinMessage,
    ])
  })
  it('creates a system message for started disputes when seller raises it', () => {
    const initiator = 'seller'
    const initiatorId = 'sellerId'
    const reason = i18n('dispute.reason.other')
    const contract: Partial<Contract> = {
      id: '123-456',
      disputeDate: now,
      disputeInitiator: initiatorId,
      seller: {
        id: 'sellerId',
      } as User,
      disputeReason: 'other',
    }
    expect(initDisputeSystemMessages(roomId, contract as Contract)).toEqual([
      {
        date: now,
        from: 'system',
        message: i18n('chat.systemMessage.disputeStarted', initiator, 'PeachsellerId', reason),
        readBy: [''],
        roomId,
        signature: expect.any(String),
      },
      mediatorWillJoinMessage,
    ])
  })
  it('creates a system message with extra info if email is required', () => {
    const initiator = 'buyer'
    const initiatorId = 'buyerId'
    const reason = i18n('dispute.reason.noPayment.seller')
    const contract: Partial<Contract> = {
      id: '123-456',
      disputeDate: now,
      disputeInitiator: initiatorId,
      seller: {
        id: 'sellerId',
      } as User,
      disputeReason: 'noPayment.seller',
    }
    expect(initDisputeSystemMessages(roomId, contract as Contract)).toEqual([
      {
        date: now,
        from: 'system',
        message: i18n('chat.systemMessage.disputeStarted', initiator, 'PeachbuyerId', reason),
        readBy: [''],
        roomId,
        signature: expect.any(String),
      },
      mediatorWillJoinMessage,
      provideMoreInformationMessage,
    ])
  })
})
