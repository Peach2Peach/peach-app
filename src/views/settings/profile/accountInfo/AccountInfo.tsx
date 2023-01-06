import React from 'react'
import { account } from '../../../../utils/account'
import tw from '../../../../styles/tailwind'
import { Trades } from './Trades'
import { PublicKey } from './PublicKey'
import { AccountCreated } from './AccountCreated'
import { Disputes } from './Disputes'
import { View } from 'react-native'

const style = tw`mt-4`
export const AccountInfo = ({ style: wrapperStyle, user }: { user: User } & ComponentProps) => (
  <View style={wrapperStyle}>
    <PublicKey publicKey={account.publicKey} style={style} />
    <AccountCreated {...{ ...user, style }} />
    <Disputes {...{ ...user.disputes, style }} />
    <Trades {...{ ...user, style }} />
  </View>
)
