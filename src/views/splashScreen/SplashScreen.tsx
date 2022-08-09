import React, { ReactElement } from 'react'
import { Fade } from '../../components'
import tw from '../../styles/tailwind'
import LogoType from '../../assets/logo/logoAndType.svg'

export default (): ReactElement =>
  <Fade show={true} duration={400} delay={500} style={tw`h-full flex items-center justify-center px-6`}>
    <LogoType style={tw`w-full max-h-64`}/>
  </Fade>