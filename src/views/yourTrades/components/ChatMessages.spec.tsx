import { NewChatMessages } from './ChatMessages'
import { render } from '@testing-library/react-native'

describe('ChatMessages', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<NewChatMessages messages={0} />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly with messages', () => {
    const { toJSON } = render(<NewChatMessages messages={1} />)
    expect(toJSON()).toMatchSnapshot()
  })
})
