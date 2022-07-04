import { strictEqual, deepStrictEqual } from 'assert'
import { getSession, setSession, initSession } from '../../src/utils/session'

describe('getSession', () => {
  it('returns an uninitialized session in the beginning', () => {
    strictEqual(getSession().initialized, false)
  })
})

describe('setSession', () => {
  it('sets new session', () => {
    const session = getSession()
    setSession({
      ...session,
      password: 'somePassword',
      notifications: 0,
    })
    strictEqual(getSession().initialized, true)
    strictEqual(getSession().password, 'somePassword')
    strictEqual(getSession().notifications, 0)
  })
})

describe('initSession', () => {
  it('initializes session from encrypted storage', async () => {
    setSession({ 'initialized': true, 'password': 'sessionPassword' })
    deepStrictEqual((await initSession()), {
      initialized: true,
      password: 'sessionPassword',
      notifications: 0,
    })
    deepStrictEqual(getSession(), {
      initialized: true,
      password: 'sessionPassword',
      notifications: 0,
    })
  })
})
