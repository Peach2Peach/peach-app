import React from 'react'
import { View } from 'react-native'

import tw from '../../../../styles/tailwind'
import { AccountCreated } from './AccountCreated'
import { Disputes } from './Disputes'
import { PublicKey } from './PublicKey'
import { Trades } from './Trades'

const style = tw`mt-4`
export const AccountInfo = ({ style: wrapperStyle, user }: { user: User } & ComponentProps) => (
  <View style={wrapperStyle}>
    <PublicKey publicKey={user.id} />
    <AccountCreated {...{ ...user, style }} />
    <Disputes {...{ ...user.disputes, style }} />
    <Trades {...{ ...user, style }} />
  </View>
)
