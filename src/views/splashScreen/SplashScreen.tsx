import React, { ReactElement } from 'react'
import {
  Image,
  View
} from 'react-native'
import { FadeInView } from '../../components'
import tw from '../../styles/tailwind'


export default (): ReactElement =>
  <FadeInView duration={400} delay={500} style={tw`h-full flex items-center justify-center`}>
    <Image source={require('../../../assets/favico/peach-icon-192.png')} />
  </FadeInView>