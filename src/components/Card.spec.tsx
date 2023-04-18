import { Card } from './Card'
import { render } from '@testing-library/react-native'

describe('Card', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<Card />)
    expect(toJSON()).toMatchSnapshot()
  })
})
