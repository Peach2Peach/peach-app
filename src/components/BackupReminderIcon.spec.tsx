import { TouchableOpacity } from 'react-native'
import { fireEvent, render } from 'test-utils'
import { usePopupStore } from '../store/usePopupStore'
import { BackupReminderIcon } from './BackupReminderIcon'

describe('BackupReminderIcon', () => {
  it('renders correctly', () => {
    expect(render(<BackupReminderIcon />)).toMatchSnapshot()
  })

  it('opens backup popup', () => {
    const { UNSAFE_getByType } = render(<BackupReminderIcon />)
    fireEvent.press(UNSAFE_getByType(TouchableOpacity))
    expect(usePopupStore.getState().visible).toBe(true)
  })
})
