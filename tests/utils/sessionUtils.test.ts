import { strictEqual, deepStrictEqual } from 'assert'
import * as logUtils from '../../src/utils/logUtils'
import { getSession, setSession, initSession } from '../../src/utils/sessionUtils'

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
  afterEach(() => jest.clearAllMocks())

  it('initializes session from encrypted storage', async () => {
    jest.mock('react-native-encrypted-storage', () => ({
      getItem: async (): Promise<string> => '{"initialized": true, "password": "sessionPassword"}',
    }))
    deepStrictEqual((await initSession()), {
      initialized: true,
      password: 'sessionPassword'
    })
    deepStrictEqual(getSession(), {
      initialized: true,
      password: 'sessionPassword'
    })
  })

  it('logs error for corrupted sessions', async () => {
    jest.mock('react-native-encrypted-storage', () => ({
      getItem: async (): Promise<string> => '{"corrupt}',
    }))
    const errorSpy = jest.spyOn(logUtils, 'error')
    await initSession()

    expect(errorSpy).toBeCalled()
  })
})
