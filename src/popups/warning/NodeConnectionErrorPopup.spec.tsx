import { render } from '@testing-library/react-native'
import { NodeConnectionErrorPopup } from './NodeConnectionErrorPopup'

describe('NodeConnectionErrorPopup', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<NodeConnectionErrorPopup error="error" />)
    expect(toJSON()).toMatchSnapshot()
  })
})
