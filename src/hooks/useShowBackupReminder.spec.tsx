import { renderHook } from 'test-utils'
import { FirstBackup } from '../popups/warning/FirstBackup'
import { usePopupStore } from '../store/usePopupStore'
import { useShowBackupReminder } from './useShowBackupReminder'

describe('useShowBackupReminder', () => {
  it('should upen backup reminder popup', () => {
    const { result } = renderHook(useShowBackupReminder)
    result.current()
    expect(usePopupStore.getState()).toEqual(
      expect.objectContaining({
        title: 'make a backup!',
        content: <FirstBackup />,
        visible: true,
        action2: {
          callback: expect.any(Function),
          label: 'close',
          icon: 'xSquare',
        },
        action1: {
          icon: 'arrowRightCircle',
          label: 'make a backup',
          callback: expect.any(Function),
        },
        level: 'ERROR',
      }),
    )
  })
})
