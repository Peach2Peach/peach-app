import { FixedHeightText } from './FixedHeightText'
import { render } from '@testing-library/react-native'

describe('FixedHeightText', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<FixedHeightText height={10} />)
    expect(toJSON()).toMatchSnapshot()
  })
})
