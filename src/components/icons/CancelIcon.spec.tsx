import { CancelIcon } from './CancelIcon'
import { render } from '@testing-library/react-native'

describe('CancelIcon', () => {
  it('renders correctly', () => {
    const { toJSON } = render(<CancelIcon />)
    expect(toJSON()).toMatchSnapshot()
  })
})
