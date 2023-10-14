import { render } from 'test-utils'
import { FixedHeightText } from './FixedHeightText'

describe('FixedHeightText', () => {
  it('renders correctly', () => {
    const { toJSON } = render(<FixedHeightText height={21}>TINA</FixedHeightText>)
    expect(toJSON()).toMatchSnapshot()
  })
})
