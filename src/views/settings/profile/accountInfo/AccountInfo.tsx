import { View } from 'react-native'

import tw from '../../../../styles/tailwind'
import { AccountCreated } from './AccountCreated'
import { Disputes } from './Disputes'
import { PublicKey } from './PublicKey'
import { Trades } from './Trades'

type Props = {
  user: User | PublicUser
}

export const AccountInfo = ({ user }: Props) => (
  <View style={tw`gap-4 pl-1`}>
    <PublicKey publicKey={user.id} />
    <AccountCreated {...user} />
    <Disputes {...user.disputes} />
    <Trades {...user} />
  </View>
)
