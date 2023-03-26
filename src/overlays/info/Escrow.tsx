import { ReactElement } from 'react'
import { Linking } from 'react-native'

import { Text } from '../../components'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

export const Escrow = (): ReactElement => {
  const goToEscrowInfo = () => Linking.openURL('https://peachbitcoin.com/termsConditions.html')
  return (
    <Text>
      {i18n('help.escrow.description.1')}{' '}
      <Text style={tw`underline`} onPress={goToEscrowInfo}>
        {i18n('help.escrow.description.1.link')}
      </Text>
      {'\n\n'}
      {i18n('help.escrow.description.2')}
      {'\n\n'}
      {i18n('help.escrow.description.3')}
    </Text>
  )
}
