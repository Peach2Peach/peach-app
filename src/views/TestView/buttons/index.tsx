import React from 'react'
import { GoBackButton, PeachScrollView } from '../../../components'
import tw from '../../../styles/tailwind'
import { GoBackButtons } from './GoBackButtons'
import { InfoButtons } from './InfoButtons'
import { OptionButtons } from './OptionButtons'
import { PrimaryButtons } from './PrimaryButtons'

export default () => (
  <PeachScrollView style={tw`h-full bg-primary-mild`} contentContainerStyle={tw`w-full py-10 px-6 flex items-center`}>
    <PrimaryButtons />
    <InfoButtons />
    <GoBackButtons />
    <OptionButtons />
    <GoBackButton white wide style={tw`mt-8`} />
  </PeachScrollView>
)
