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
    const { toJSON } = render(<AddressLabelInput index={1} />)
    expect(toJSON()).toMatchSnapshot()
  })
})
