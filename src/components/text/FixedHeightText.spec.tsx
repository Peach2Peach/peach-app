import { FixedHeightText } from './FixedHeightText'
import { render } from '@testing-library/react-native'

describe('FixedHeightText', () => {
  it('renders correctly', () => {
    const { toJSON } = render(<FixedHeightText height={21}>TINA</FixedHeightText>)
    expect(toJSON()).toMatchSnapshot()
  })
})
