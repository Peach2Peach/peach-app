import { BackupReminderIcon } from './BackupReminderIcon'
import { fireEvent, render } from '@testing-library/react-native'
import { usePopupStore } from '../../store/usePopupStore'
import { FirstBackup } from '../../popups/warning/FirstBackup'
import { NavigationWrapper } from '../../../tests/unit/helpers/NavigationWrapper'
import { TouchableOpacity } from 'react-native'

describe('BackupReminderIcon', () => {
  it('renders correctly', () => {
    expect(render(<BackupReminderIcon />, { wrapper: NavigationWrapper })).toMatchSnapshot()
  })

  it('opens backup popup', () => {
    const { UNSAFE_getByType } = render(<BackupReminderIcon />, { wrapper: NavigationWrapper })
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
