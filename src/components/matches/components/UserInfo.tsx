import React from 'react'

import { ProfileOverview } from '../../../views/publicProfile/components'

type UserInfoProps = { user: User } & ComponentProps

export const UserInfo = ({ user, style }: UserInfoProps) => <ProfileOverview {...{ style, user }} clickableID />
