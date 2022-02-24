
import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { Match } from '.'

interface MatchProps {
  matches: Match[],
}

/**
 * @description Component to display matches
 * @example
 * <Matches matches={matches} />
 */
export const Matches = ({ matches }: MatchProps): ReactElement => <View>
  {matches.map(match => <Match key={match.offerId} match={match} />)}
</View>

export default Matches