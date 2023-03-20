import { useSettingsStore } from '../store/settingsStore'
import { useShowBackupReminder } from './useShowBackupReminder'
import { useShowWarning } from './useShowWarning'

jest.mock('./useShowWarning')

// Mock implementation of useSettingsStore hook
jest.mock('../store/settingsStore', () => ({
  useSettingsStore: jest.fn(),
}))

describe('useShowBackupReminder', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('calls useShowWarning with "firstBackup" when lastBackupDate is falsy', () => {
    ;(useSettingsStore as jest.Mock).mockReturnValue({ lastBackupDate: null })
    useShowBackupReminder()
    expect(useShowWarning).toHaveBeenCalledWith('firstBackup')
  })

  it('calls useShowWarning with "paymentBackup" when lastBackupDate is truthy', () => {
    ;(useSettingsStore as jest.Mock).mockReturnValue({ lastBackupDate: '2022-03-19T10:21:32.000Z' })
    useShowBackupReminder()
    expect(useShowWarning).toHaveBeenCalledWith('paymentBackup')
  })

  it('returns showFirstBackupWarning when lastBackupDate is falsy', () => {
    ;(useSettingsStore as jest.Mock).mockReturnValue({ lastBackupDate: null })
    ;(useShowWarning as jest.Mock).mockReturnValue('showFirstBackupWarning')
    const result = useShowBackupReminder()
    expect(result).toEqual('showFirstBackupWarning')
  })

  it('returns showPaymentBackupWarning when lastBackupDate is truthy', () => {
    ;(useSettingsStore as jest.Mock).mockReturnValue({ lastBackupDate: '2022-03-19T10:21:32.000Z' })
    ;(useShowWarning as jest.Mock).mockReturnValue('showPaymentBackupWarning')
    const result = useShowBackupReminder()
    expect(result).toEqual('showPaymentBackupWarning')
  })
})
