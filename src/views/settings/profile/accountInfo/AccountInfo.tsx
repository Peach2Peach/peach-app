import { View } from 'react-native'

import tw from '../../../../styles/tailwind'
import { AccountCreated } from './AccountCreated'
import { Disputes } from './Disputes'
import { PublicKey } from './PublicKey'
import { Trades } from './Trades'

type Props = ComponentProps & {
  user: User
}

export const AccountInfo = ({ style: wrapperStyle, user }: Props) => (
  <View style={[tw`gap-4 pl-1`, wrapperStyle]}>
    <PublicKey publicKey={user.id} />
    <AccountCreated {...user} />
    <Disputes {...user.disputes} />
    <Trades {...user} />
  </View>
)
