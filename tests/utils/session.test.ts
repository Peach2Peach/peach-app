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
      password: 'somePassword'
    })
    strictEqual(getSession().initialized, true)
    strictEqual(getSession().password, 'somePassword')
  })
})

describe('initSession', () => {
  it('initializes session from encrypted storage', async () => {
    setSession({ 'initialized': true, 'password': 'sessionPassword' })
    deepStrictEqual((await initSession()), {
      initialized: true,
      password: 'sessionPassword'
    })
    deepStrictEqual(getSession(), {
      initialized: true,
      password: 'sessionPassword'
    })
  })
})
