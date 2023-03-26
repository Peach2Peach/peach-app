import { create } from 'react-test-renderer'
import { Text } from '../../components'
import i18n from '../../utils/i18n'
import { BuyingBitcoin } from './BuyingBitcoin'

describe('BuyingBitcoin', () => {
  it('should render correctly', () => {
    const testInstance = create(<BuyingBitcoin />).root

    expect(testInstance.findByType(Text).props.children).toBe(i18n('help.buyingBitcoin.description'))
  })
})
