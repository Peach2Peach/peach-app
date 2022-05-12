import React, { ReactElement } from 'react'
import { Image } from 'react-native'
import { Fade } from '../../components'
import tw from '../../styles/tailwind'


export default (): ReactElement =>
  <Fade show={true} duration={400} delay={500} style={tw`h-full flex items-center justify-center px-6`}>
    <Image source={require('../../../assets/favico/peach-logo.png')} />
  </Fade>