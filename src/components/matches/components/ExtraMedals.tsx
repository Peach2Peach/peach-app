import React, { ReactElement } from 'react'
import { View } from 'react-native'
import tw from '../../../styles/tailwind'
import Medal from '../../medal'

type ExtraMedalsProps = ComponentProps & {
  user: User,
}

/**
 * @description Component to display a extra user medals
 * @param user the user
 */
export const ExtraMedals = ({ user, style }: ExtraMedalsProps): ReactElement =>
  <View style={[tw`flex-row justify-between`, style]}>
    <Medal id="gold" style={tw`w-5 h-4 opacity-50`}/>
    <Medal id="gold" style={tw`w-5 h-4`}/>
    <Medal id="gold" style={tw`w-5 h-4 opacity-50`}/>
  </View>