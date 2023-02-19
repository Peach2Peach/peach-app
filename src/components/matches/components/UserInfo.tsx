import React from 'react'

import { ProfileOverview } from '../../../views/publicProfile/components'
import { PublicProfileOverview } from '../../../views/publicProfile/components/ProfileOverview'

type UserInfoProps = { user: User } & ComponentProps

export const UserInfo = ({ user, style }: UserInfoProps) => <ProfileOverview {...{ style, user }} clickableID />

export const MatchCardCounterparty = (props: UserInfoProps) => <PublicProfileOverview {...props} clickableID />
