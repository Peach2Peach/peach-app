import { NETWORK } from '@env'
import { StyleProp, ViewStyle } from 'react-native'
import { Button } from '../../components/buttons/Button'
import tw from '../../styles/tailwind'
import { showAddress, showTransaction } from '../../utils/bitcoin'
import i18n from '../../utils/i18n'

type Props = {
  releaseTxId?: string
  escrow: string
  style?: StyleProp<ViewStyle>
}

export function EscrowButton ({ releaseTxId, escrow, style }: Props) {
  const openEscrow = () => (releaseTxId ? showTransaction(releaseTxId, NETWORK) : showAddress(escrow, NETWORK))

  return (
    <Button iconId="externalLink" style={style} textColor={tw`text-primary-main`} ghost onPress={openEscrow}>
      {i18n('escrow')}
    </Button>
  )
}
