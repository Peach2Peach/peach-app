import { render } from 'test-utils'
import { ReceiveAddressInput } from './ReceiveAddressInput'

describe('ReceiveAddressInput', () => {
  it('should render correctly', () => {
    expect(render(<ReceiveAddressInput />)).toMatchSnapshot()
  })
})
