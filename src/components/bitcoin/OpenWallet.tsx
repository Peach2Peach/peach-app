import 'react-native-url-polyfill/auto'

import { TouchableOpacity } from 'react-native'
import { Icon, Text } from '..'
import tw from '../../styles/tailwind'
import { openInWallet } from '../../utils/bitcoin/openInWallet'
import i18n from '../../utils/i18n'

type OpenWalletProps = ComponentProps & {
  address?: string
}

export const OpenWallet = ({ address, style }: OpenWalletProps) => {
  const openWalletApp = () => openInWallet(`bitcoin:${address ?? ''}`)

  return (
    <TouchableOpacity style={[tw`flex-row items-center justify-center`, style]} onPress={openWalletApp}>
      <Text style={tw`underline uppercase button-medium text-black-2`}>{i18n('wallet.openWalletApp')}</Text>
      <Icon id="externalLink" style={tw`w-4 h-4 ml-1 -mt-1`} color={tw.color('primary-main')} />
    </TouchableOpacity>
  )
}
