import { renderHook, waitFor } from '@testing-library/react-native'
import { useNewUserSetup } from './useNewUserSetup'
import { MSINANHOUR } from '../../../constants'
import { account1 } from '../../../../tests/unit/data/accountData'

jest.mock('@react-navigation/native', () => ({
  useFocusEffect: jest.fn(),
}))

const navigationReplaceMock = jest.fn()
const useNavigationMock = jest.fn().mockReturnValue({
  replace: (...args: any[]) => navigationReplaceMock(...args),
})
jest.mock('../../../hooks/useNavigation', () => ({
  useNavigation: () => useNavigationMock(),
}))

const useRouteMock = jest.fn().mockReturnValue({
  params: {},
})
jest.mock('../../../hooks/useRoute', () => ({
  useRoute: () => useRouteMock(),
}))

const updateAccountMock = jest.fn()
jest.mock('../../../utils/account/updateAccount', () => ({
  updateAccount: (...args: any[]) => updateAccountMock(...args),
}))
const createAccountMock = jest.fn().mockResolvedValue(account1)
jest.mock('../../../utils/account/createAccount', () => ({
  createAccount: (...args: any[]) => createAccountMock(...args),
}))

const storeAccountMock = jest.fn()
jest.mock('../../../utils/account/storeAccount', () => ({
  storeAccount: (...args: any[]) => storeAccountMock(...args),
}))

const apiSuccess = {
  expiry: Date.now() + MSINANHOUR,
  accessToken: 'accessToken',
}
const authMock = jest.fn().mockResolvedValue([apiSuccess, null])
jest.mock('../../../utils/peachAPI', () => ({
  auth: (...args: any[]) => authMock(...args),
}))

describe('useNewUserSetup', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('creates a new account', async () => {
    renderHook(useNewUserSetup)
    await waitFor(() => {
      expect(authMock).toHaveBeenCalled()
    })
    expect(updateAccountMock).toHaveBeenCalledWith(account1, true)
    expect(createAccountMock).toHaveBeenCalled()
    expect(storeAccountMock).toHaveBeenCalled()
  })
})
