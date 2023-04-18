import { Flag } from './Flag'
import { render } from '@testing-library/react-native'

describe('Flag', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<Flag id="DE" />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly when flag is not found', () => {
    // @ts-expect-error
    const { toJSON } = render(<Flag id="XX" />)
    expect(toJSON()).toMatchSnapshot()
  })
})
