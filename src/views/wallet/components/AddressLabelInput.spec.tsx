import { render } from 'test-utils'
import { AddressLabelInput } from './AddressLabelInput'

describe('AddressLabelInput', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<AddressLabelInput index={1} />)
    expect(toJSON()).toMatchSnapshot()
  })
})
