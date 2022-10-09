import { deepStrictEqual, strictEqual } from 'assert'
import { getSession, initSession, setSessionItem } from '../../../src/utils/session'
import { setStorage, storage } from '../prepare'

describe('getSession', () => {
  it('returns an uninitialized session in the beginning', () => {
    strictEqual(getSession().initialized, false)
  })
})

describe('setSessionItem', () => {
  it('sets a single session item', async () => {
    await setSessionItem('password', 'somePassword')
    strictEqual(getSession().password, 'somePassword')
    strictEqual(storage.password, 'somePassword')
  })
})

describe('initSession', () => {
  it('initializes session from encrypted storage', async () => {
    setStorage({ initialized: true, password: 'sessionPassword', notifications: '0' })
    deepStrictEqual(await initSession(), {
      initialized: true,
      password: 'sessionPassword',
      notifications: 0,
      peachInfo: undefined,
      unsavedPaymentData: [],
    })
    deepStrictEqual(getSession(), {
      initialized: true,
      password: 'sessionPassword',
      notifications: 0,
      peachInfo: undefined,
      unsavedPaymentData: [],
    })
  })
})
