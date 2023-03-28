/* eslint-disable max-lines-per-function */
import i18n from '../i18n'
import { endDisputeSystemMessages } from './endDisputeSystemMessages'

describe('endDisputeSystemMessages', () => {
  const now = new Date()
  const roomId = 'room-id'
  const noLongerMediatedMessage: Message = {
    date: now,
    from: 'system',
    message: i18n('chat.systemMessage.noLongerMediated'),
    readBy: [''],
    roomId,
    signature: expect.any(String),
  }
  it('creates an ending dispute system message when the buyer wins', () => {
    const contract: Partial<Contract> = {
      disputeResolvedDate: now,
      disputeOutcome: 'buyerWins',
    }
    expect(endDisputeSystemMessages(roomId, contract as Contract)).toEqual([
      {
        date: now,
        from: 'system',
        message: i18n('chat.systemMessage.dispute.outcome.buyerWins'),
        readBy: [''],
        roomId,
        signature: expect.any(String),
      },
      noLongerMediatedMessage,
    ])
  })
  it('creates an ending dispute system message when the seller wins', () => {
    const contract: Partial<Contract> = {
      disputeResolvedDate: now,
      disputeOutcome: 'sellerWins',
    }
    expect(endDisputeSystemMessages(roomId, contract as Contract)).toEqual([
      {
        date: now,
        from: 'system',
        message: i18n('chat.systemMessage.dispute.outcome.sellerWins'),
        readBy: [''],
        roomId,
        signature: expect.any(String),
      },
      noLongerMediatedMessage,
    ])
  })
  it('creates an ending dispute system message when trade is canceled', () => {
    const contract: Partial<Contract> = {
      disputeResolvedDate: now,
      disputeOutcome: 'cancelTrade',
    }
    expect(endDisputeSystemMessages(roomId, contract as Contract)).toEqual([
      {
        date: now,
        from: 'system',
        message: i18n('chat.systemMessage.dispute.outcome.cancelTrade'),
        readBy: [''],
        roomId,
        signature: expect.any(String),
      },
      noLongerMediatedMessage,
    ])
  })
  it('creates an ending dispute system message when payout to buyer should be made', () => {
    const contract: Partial<Contract> = {
      disputeResolvedDate: now,
      disputeOutcome: 'payOutBuyer',
    }
    expect(endDisputeSystemMessages(roomId, contract as Contract)).toEqual([
      {
        date: now,
        from: 'system',
        message: i18n('chat.systemMessage.dispute.outcome.payOutBuyer'),
        readBy: [''],
        roomId,
        signature: expect.any(String),
      },
      noLongerMediatedMessage,
    ])
  })
  it('creates an ending dispute system message when dispute is not a dispute', () => {
    const contract: Partial<Contract> = {
      disputeResolvedDate: now,
      disputeOutcome: 'none',
    }
    expect(endDisputeSystemMessages(roomId, contract as Contract)).toEqual([
      {
        date: now,
        from: 'system',
        message: i18n('chat.systemMessage.dispute.outcome.none'),
        readBy: [''],
        roomId,
        signature: expect.any(String),
      },
      noLongerMediatedMessage,
    ])
  })
})
