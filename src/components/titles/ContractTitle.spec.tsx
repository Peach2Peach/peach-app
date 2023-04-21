import { ContractTitle } from './ContractTitle'
import { render } from '@testing-library/react-native'

describe('ContractTitle', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<ContractTitle id="123-456" />)
    expect(toJSON()).toMatchSnapshot()
  })
})
