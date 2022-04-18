import React, { ReactElement } from 'react'
import { Image, ImageSourcePropType } from 'react-native'

type MedalTypes = 'gold' | 'silver'
type MedalProps = ComponentProps & {
  id: MedalTypes
}

type Medals = {
  [key in MedalTypes]: ImageSourcePropType
}

const medals: Medals = {
  gold: require('./gold.png'),
  silver: require('./silver.png'),
}

export const Medal = ({ id, style }: MedalProps): ReactElement =>
  <Image source={medals[id]} style={[style, { resizeMode: 'contain' }]}/>

export default Medal