import { renderHook } from '@testing-library/react-native'
import { useBuySetup } from './useBuySetup'
import { NavigationWrapper, replaceMock } from '../../../../tests/unit/helpers/NavigationWrapper'

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

describe('useBuySetup', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should add the correct header', () => {
    renderHook(useBuySetup, { wrapper: NavigationWrapper })

    expect(useHeaderSetupMock).toHaveBeenCalled()
    const args = useHeaderSetupMock.mock.calls[0][0]
    expect(args.titleComponent).toMatchInlineSnapshot('<BuyTitleComponent />')
    expect(args.hideGoBackButton).toBe(true)
    expect(args.icons[0].iconComponent).toMatchInlineSnapshot('<HelpIcon />')
    expect(args.icons[0].onPress).toBe(showHelpMock)
  })

  it('should replace screen with backupTime if backupDates are null and isBackupMandatory is true', () => {
    mockIsBackupMandatory.mockReturnValue(true)

    renderHook(useBuySetup, { wrapper: NavigationWrapper })

    expect(replaceMock).toHaveBeenCalledWith('backupTime', { view: 'buyer' })
  })

  it('should not replace screen with backupTime if any backupDate is not null or backup isn\'t mandatory', () => {
    useSettingsStoreMock.mockImplementationOnce((selector) =>
      selector({ lastFileBackupDate: '2021-01-01', lastSeedBackupDate: null }),
    )

    renderHook(useBuySetup, { wrapper: NavigationWrapper })

    expect(replaceMock).not.toHaveBeenCalled()

    useSettingsStoreMock.mockImplementationOnce((selector) =>
      selector({ lastFileBackupDate: null, lastSeedBackupDate: '2021-01-01' }),
    )

    renderHook(useBuySetup, { wrapper: NavigationWrapper })

    expect(replaceMock).not.toHaveBeenCalled()

    mockIsBackupMandatory.mockReturnValue(false)

    renderHook(useBuySetup, { wrapper: NavigationWrapper })

    expect(replaceMock).not.toHaveBeenCalled()
  })
})
