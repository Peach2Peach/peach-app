import { DisputeContractTitle } from './DisputeContractTitle'
import { render } from '@testing-library/react-native'

describe('DisputeContractTitle', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<DisputeContractTitle id="123-456" />)
    expect(toJSON()).toMatchSnapshot()
  })
})
