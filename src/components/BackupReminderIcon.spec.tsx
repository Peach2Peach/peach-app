import { TouchableOpacity } from 'react-native'
import { fireEvent, render } from 'test-utils'
import { FirstBackup } from '../popups/warning/FirstBackup'
import { usePopupStore } from '../store/usePopupStore'
import { BackupReminderIcon } from './BackupReminderIcon'

describe('BackupReminderIcon', () => {
  it('renders correctly', () => {
    expect(render(<BackupReminderIcon />)).toMatchSnapshot()
  })

  it('opens backup popup', () => {
    const { UNSAFE_getByType } = render(<BackupReminderIcon />)
    fireEvent.press(UNSAFE_getByType(TouchableOpacity))
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
