import { ReceiveAddressInput } from './ReceiveAddressInput'
import { render } from '@testing-library/react-native'

describe('ReceiveAddressInput', () => {
  it('should render correctly', () => {
    expect(render(<ReceiveAddressInput />)).toMatchSnapshot()
  })
})
