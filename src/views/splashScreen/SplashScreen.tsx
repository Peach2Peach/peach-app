import React, { ReactElement, useEffect, useState } from 'react'
import { Fade } from '../../components'
import tw from '../../styles/tailwind'
import LogoType from '../../assets/logo/logoAndType.svg'

export default (): ReactElement => {
  const [show, setShow] = useState(false)

  useEffect(() => setShow(true), [])

  return <Fade show={show} duration={400} delay={500} style={tw`h-full flex items-center justify-center px-6`}>
    <LogoType style={tw`w-96 max-w-full h-full max-h-64`}/>
  </Fade>
}