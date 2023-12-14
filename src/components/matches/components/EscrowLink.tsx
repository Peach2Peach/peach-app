import { NETWORK } from '@env'
import { TouchableOpacity } from 'react-native'
import tw from '../../../styles/tailwind'
import { showAddress } from '../../../utils/bitcoin/showAddress'
import i18n from '../../../utils/i18n'
import { Icon } from '../../Icon'
import { PeachText } from '../../text/Text'

export const EscrowLink = ({ address }: { address: string }) => (
  <>
    <TouchableOpacity style={tw`flex-row items-end self-center`} onPress={() => showAddress(address, NETWORK)}>
      <PeachText style={tw`underline tooltip text-black-2`}>{i18n('match.viewInEscrow')}</PeachText>
      <Icon id="externalLink" style={tw`w-[18px] h-[18px] ml-[2px] mb-[2px]`} color={tw.color('primary-main')} />
    </TouchableOpacity>
  </>
)
