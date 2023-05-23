import { renderHook } from '@testing-library/react-native'
import i18n from '../../../utils/i18n'
import { useFileBackupOverviewSetup } from './useFileBackupOverviewSetup'

jest.mock('@react-navigation/native', () => ({
  useFocusEffect: jest.fn(),
}))
jest.mock('../../../hooks/useNavigation', () => ({
  useNavigation: jest.fn().mockReturnValue({
    navigate: jest.fn(),
  }),
}))

const useSettingsStoreMock = jest.fn((selector, _compareFn) => selector({ lastFileBackupDate: 'correctDateFromStore' }))
jest.mock('../../../store/settingsStore', () => ({
  useSettingsStore: (selector: any, compareFn: any) => useSettingsStoreMock(selector, compareFn),
}))

const useHeaderSetupMock = jest.fn()
jest.mock('../../../hooks/useHeaderSetup', () => ({
  useHeaderSetup: (...args: any) => useHeaderSetupMock(...args),
}))

const showHelpMock = jest.fn()
jest.mock('../../../hooks/useShowHelp', () => ({
  useShowHelp: () => showHelpMock,
}))

describe('useFileBackupOverviewSetup', () => {
  const { result } = renderHook(useFileBackupOverviewSetup)
  it('returns default correct values', () => {
    expect(result.current.lastFileBackupDate).toBe('correctDateFromStore')
  })
  it('sets up the header correctly', () => {
    expect(useHeaderSetupMock).toHaveBeenCalled()
    const args = useHeaderSetupMock.mock.calls[0][0]
    expect(args.title).toBe(i18n('settings.backups.fileBackup.title'))
    expect(args.icons[0].id).toBe('helpCircle')
    expect(args.icons[0].onPress).toBe(showHelpMock)
  })
})
