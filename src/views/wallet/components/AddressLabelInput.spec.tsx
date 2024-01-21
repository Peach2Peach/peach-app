import { render } from 'test-utils'
import { createTestWallet } from '../../../../tests/unit/helpers/createTestWallet'
import { PeachWallet } from '../../../utils/wallet/PeachWallet'
import { setPeachWallet } from '../../../utils/wallet/setWallet'
import { AddressLabelInput } from './AddressLabelInput'

describe('AddressLabelInput', () => {
  beforeEach(() => {
    setPeachWallet(new PeachWallet({ wallet: createTestWallet() }))
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
