import React from 'react'
import { PeachScrollView } from '../../../components'
import { useHeaderSetup } from '../../../hooks'
import tw from '../../../styles/tailwind'
import { InfoButtons } from './InfoButtons'
import { OptionButtons } from './OptionButtons'
import { PrimaryButtons } from './PrimaryButtons'

const headerConfig = { title: 'test view - buttons' }

export default () => {
  useHeaderSetup(headerConfig)
  return (
    <PeachScrollView
      style={tw`h-full bg-primary-mild-1`}
      contentContainerStyle={tw`flex items-center w-full px-6 py-10`}
    >
      <PrimaryButtons />
      <InfoButtons />
      <OptionButtons />
    </PeachScrollView>
  )
}
