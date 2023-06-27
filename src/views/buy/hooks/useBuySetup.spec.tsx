import { renderHook, waitFor } from '@testing-library/react-native'
import { defaultSelfUser } from '../../../../tests/unit/data/userData'
import { NavigationAndQueryClientWrapper } from '../../../../tests/unit/helpers/NavigationAndQueryClientWrapper'
import { useBuySetup } from './useBuySetup'

const useHeaderSetupMock = jest.fn()
jest.mock('../../../hooks/useHeaderSetup', () => ({
  useHeaderSetup: (...args: any) => useHeaderSetupMock(...args),
}))

const showHelpMock = jest.fn()
const useShowHelpMock = jest.fn((..._args) => showHelpMock)
jest.mock('../../../hooks/useShowHelp', () => ({
  useShowHelp: (...args: any) => useShowHelpMock(...args),
}))

const useSettingsStoreMock = jest.fn((selector, _compareFn) =>
  selector({ lastFileBackupDate: null, lastSeedBackupDate: null }),
)
jest.mock('../../../store/settingsStore', () => ({
  useSettingsStore: (selector: any, compareFn: any) => useSettingsStoreMock(selector, compareFn),
}))

const mockIsBackupMandatory = jest.fn().mockReturnValue(false)
jest.mock('../../../utils/account', () => ({
  isBackupMandatory: () => mockIsBackupMandatory(),
}))

const getSelfUserMock = jest.fn().mockResolvedValue([defaultSelfUser, null])
jest.mock('../../../utils/peachAPI', () => ({
  getSelfUser: () => getSelfUserMock(),
}))

const wrapper = NavigationAndQueryClientWrapper

jest.useFakeTimers()

describe('useBuySetup', () => {
  it('should return default values', () => {
    const { result } = renderHook(useBuySetup, { wrapper })
    expect(result.current).toEqual({
      freeTrades: 0,
      maxFreeTrades: 0,
    })
  })

  it('should free trades from user', async () => {
    const freeTrades = 5
    const maxFreeTrades = 5
    getSelfUserMock.mockResolvedValueOnce([{ ...defaultSelfUser, freeTrades, maxFreeTrades }, null])
    const { result } = renderHook(useBuySetup, { wrapper })
    await waitFor(() => expect(result.current.freeTrades).toEqual(freeTrades))
    expect(result.current.freeTrades).toEqual(maxFreeTrades)
  })

  it('should add the correct header', () => {
    renderHook(useBuySetup, { wrapper })

    expect(useHeaderSetupMock).toHaveBeenCalled()
    const args = useHeaderSetupMock.mock.calls[0][0]
    expect(args.titleComponent).toMatchInlineSnapshot('<BuyTitleComponent />')
    expect(args.hideGoBackButton).toBe(true)
    expect(args.icons[0].id).toBe('helpCircle')
    expect(args.icons[0].color).toBe('#099DE2')
    expect(args.icons[0].onPress).toBe(showHelpMock)
  })
})
