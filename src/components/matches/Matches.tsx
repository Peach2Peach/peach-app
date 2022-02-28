
import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { Match } from '.'
import Swiper from 'react-native-swiper'
import tw from '../../styles/tailwind'

interface MatchProps {
  matches: Match[],
  onChange: (i: number) => void,
}

/**
 * @description Component to display matches
 * @example
 * <Matches matches={matches} />
 */
export const Matches = ({ matches, onChange }: MatchProps): ReactElement => <View style={[tw`flex`, { height: 156 }]}>
  <Swiper loop={true} onIndexChanged={onChange} showsButtons={true} showsPagination={false}>
    {matches.map(match => <View style={tw`flex px-2`} >
      <Match key={match.offerId} match={match}/>
    </View>)}
  </Swiper>
</View>

export default Matches