import { Escrow } from './Escrow'
import { fireEvent, render } from '@testing-library/react-native'
import { createRenderer } from 'react-test-renderer/shallow'
import i18n from '../../utils/i18n'
import { Linking } from 'react-native'

describe('Escrow', () => {
  const renderer = createRenderer()
  it('renders correctly', () => {
    renderer.render(<Escrow contract={{ releaseTxId: undefined, escrow: '123', disputeActive: false } as Contract} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly with an active dispute', () => {
    renderer.render(<Escrow contract={{ releaseTxId: undefined, escrow: '123', disputeActive: true } as Contract} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('opens a link with the releaseTxId when it is present', () => {
    const { getByText } = render(
      <Escrow contract={{ releaseTxId: '123', escrow: '123', disputeActive: false } as Contract} />,
    )
    fireEvent.press(getByText(i18n('escrow')))
    expect(Linking.openURL).toHaveBeenCalledWith('https://mempool.space/testnet/tx/123')
  })
  it('opens a link with the escrow address when the releaseTxId is not present', () => {
    const { getByText } = render(
      <Escrow contract={{ releaseTxId: undefined, escrow: '123', disputeActive: false } as Contract} />,
    )
    fireEvent.press(getByText(i18n('escrow')))
    expect(Linking.openURL).toHaveBeenCalledWith('https://mempool.space/testnet/address/123')
  })
})
