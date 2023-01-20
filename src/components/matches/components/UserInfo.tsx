import React from 'react'

import tw from '../../../styles/tailwind'
import { ProfileOverview } from '../../../views/publicProfile/components'

type UserInfoProps = { user: User }

export const UserInfo = ({ user }: UserInfoProps) => <ProfileOverview user={user} style={tw`mb-2`} clickableID />
