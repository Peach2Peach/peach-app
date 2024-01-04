import { render } from 'test-utils'
import { PeachWallet } from '../../../utils/wallet/PeachWallet'
import { setPeachWallet } from '../../../utils/wallet/setWallet'
import { AddressLabelInput } from './AddressLabelInput'

describe('AddressLabelInput', () => {
  beforeEach(() => {
    // @ts-expect-error mock doesn't need args
    setPeachWallet(new PeachWallet())
  })
  it('should render correctly', () => {
    const { toJSON } = render(<AddressLabelInput address={'address'} />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly with callback', () => {
    const { toJSON } = render(<AddressLabelInput address="" fallback={'fallback'} />)
    expect(toJSON()).toMatchSnapshot()
  })
})
