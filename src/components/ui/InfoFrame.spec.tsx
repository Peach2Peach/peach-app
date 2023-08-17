import { render } from '@testing-library/react-native'
import { InfoFrame } from './InfoFrame'

describe('InfoFrame', () => {
  it('renders correctly', () => {
    const { toJSON } = render(<InfoFrame text="test text" />)
    expect(toJSON()).toMatchSnapshot()
  })
})
