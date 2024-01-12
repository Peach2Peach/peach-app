import { TouchableOpacity } from 'react-native'
import { fireEvent, render } from 'test-utils'
import { BackupReminderIcon } from './BackupReminderIcon'
import { Popup } from './popup/Popup'

describe('BackupReminderIcon', () => {
  it('renders correctly', () => {
    expect(render(<BackupReminderIcon />)).toMatchSnapshot()
  })

  it('opens backup popup', () => {
    const { UNSAFE_getByType, getByText } = render(
      <>
        <BackupReminderIcon />
        <Popup />
      </>,
    )
    fireEvent.press(UNSAFE_getByType(TouchableOpacity))
    expect(getByText('make a backup!')).toBeTruthy()
  })
})
