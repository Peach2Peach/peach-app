import { renderHook } from '@testing-library/react-hooks'

import { useBuySetup } from './useBuySetup'

const navigationReplaceMock = jest.fn()
const useNavigationMock = jest.fn(() => ({
  replace: navigationReplaceMock,
}))
const useHeaderSetupMock = jest.fn()
const showHelpMock = jest.fn()
const useShowHelpMock = jest.fn((...args) => showHelpMock)
jest.mock('../../../hooks', () => ({
  useNavigation: () => useNavigationMock(),
  useHeaderSetup: (...args) => useHeaderSetupMock(...args),
  useShowHelp: (...args) => useShowHelpMock(...args),
}))

const useSettingsStoreMock = jest.fn((selector) => selector({ lastBackupDate: null }))
jest.mock('../../../store/settingsStore', () => ({
  useSettingsStore: (selector) => useSettingsStoreMock(selector),
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
    renderHook(useBuySetup)

    expect(useHeaderSetupMock).toHaveBeenCalled()
    const args = useHeaderSetupMock.mock.calls[0][0]
    expect(args.titleComponent).toMatchInlineSnapshot('<BuyTitleComponent />')
    expect(args.hideGoBackButton).toBe(true)
    expect(args.icons[0].iconComponent).toMatchInlineSnapshot('<HelpIcon />')
    expect(args.icons[0].onPress).toBe(showHelpMock)
  })

  it('should replace screen with backupTime if lastBackupDate is null and isBackupMandatory is true', () => {
    mockIsBackupMandatory.mockReturnValue(true)

    renderHook(useBuySetup)

    expect(navigationReplaceMock).toHaveBeenCalledWith('backupTime', { view: 'buyer' })
  })

  it('should not replace screen with backupTime if lastBackupDate is not null', () => {
    useSettingsStoreMock.mockImplementationOnce((selector) => selector({ lastBackupDate: '2021-01-01' }))

    renderHook(useBuySetup)

    expect(navigationReplaceMock).not.toHaveBeenCalled()
  })
})
