import React from 'react'
import { PeachScrollView } from '../../components'

import tw from '../../styles/tailwind'
import { Buttons } from './buttons'

export default () => (
  <PeachScrollView contentContainerStyle={tw`py-10 bg-primary-mild`}>
    <Buttons />
  </PeachScrollView>
)
