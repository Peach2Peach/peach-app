import Clipboard from '@react-native-clipboard/clipboard'
import { fireEvent, render } from 'test-utils'
import { contract } from '../../../../../tests/unit/data/contractData'
import { PublicKey } from './PublicKey'

describe('PublicKey', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<PublicKey publicKey={contract.buyer.id} />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should copy public key', () => {
    const setStringSpy = jest.spyOn(Clipboard, 'setString')
    const { getByAccessibilityHint, toJSON } = render(<PublicKey publicKey={contract.buyer.id} />)
    fireEvent.press(getByAccessibilityHint('copy'))
    expect(setStringSpy).toHaveBeenCalledWith(contract.buyer.id)
    expect(toJSON()).toMatchSnapshot()
  })
})
