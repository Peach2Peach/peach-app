import tw from '../../../styles/tailwind'

import { ProfileOverview } from '../../../views/publicProfile/components'

type Props = { user: User }

export const MatchCardCounterparty = (props: Props) => (
  <ProfileOverview {...props} style={tw`items-center`} clickableID />
)
