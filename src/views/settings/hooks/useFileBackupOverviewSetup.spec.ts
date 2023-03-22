import { renderHook } from '@testing-library/react-hooks'
import { useSettingsStore } from '../../../store/settingsStore'
import { useFileBackupOverviewSetup } from './useFileBackupOverviewSetup'

jest.mock('@react-navigation/native', () => ({
  useFocusEffect: jest.fn(),
}))
jest.mock('../../../hooks/useNavigation', () => ({
  useNavigation: jest.fn().mockReturnValue({
    navigate: jest.fn(),
  }),
}))
jest.mock('../../../store/settingsStore')

describe('useFileBackupOverviewSetup', () => {
  const now = new Date('2020-01-01')

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(now)
    ;(useSettingsStore as jest.Mock).mockReturnValue(now.getTime())
  })
  afterEach(() => {
    jest.resetAllMocks()
  })
  it('returns default correct values', () => {
    const { result } = renderHook(useFileBackupOverviewSetup)
    expect(result.current.lastFileBackupDate).toBe(now.getTime())
  })
})
