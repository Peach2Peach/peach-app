import React from 'react'

import { ProfileOverview } from '../../../views/publicProfile/components'

type Props = { user: User } & ComponentProps

export const MatchCardCounterparty = (props: Props) => <ProfileOverview {...props} clickableID />
