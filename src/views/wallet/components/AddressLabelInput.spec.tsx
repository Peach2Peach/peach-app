import { render } from 'test-utils'
import { AddressLabelInput } from './AddressLabelInput'

describe('AddressLabelInput', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<AddressLabelInput address={'address'} />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly with callback', () => {
    const { toJSON } = render(<AddressLabelInput fallback={'fallback'} />)
    expect(toJSON()).toMatchSnapshot()
  })
})
