import { getContractChatNotification } from './getContractChatNotification'

describe('getContractChatNotification', () => {
  const contractWithMessages = {
    unreadMessages: 1,
  }
  const contractWithoutMessages = {
    unreadMessages: 0,
  }
  const contractWithoutUnreadMessages = {}
  it('get unread notifiactions', () => {
    expect(getContractChatNotification(contractWithMessages)).toBe(1)
    expect(getContractChatNotification(contractWithoutMessages)).toBe(0)
    // @ts-expect-error we had 0 as a fallback in case of undefined.
    // Ideally we can remove this after confirming that the API always returns a number
    expect(getContractChatNotification(contractWithoutUnreadMessages)).toBe(0)
  })
})
