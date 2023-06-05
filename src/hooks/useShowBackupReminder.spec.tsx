import { renderHook } from '@testing-library/react-native'
import { NavigationWrapper } from '../../tests/unit/helpers/NavigationWrapper'
import { FirstBackup } from '../overlays/warning/FirstBackup'
import { usePopupStore } from '../store/usePopupStore'
import { useShowBackupReminder } from './useShowBackupReminder'

describe('useShowBackupReminder', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should upen backup reminder popup', () => {
    const { result } = renderHook(useShowBackupReminder, { wrapper: NavigationWrapper })
    result.current()
    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
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
    })
  })
})
