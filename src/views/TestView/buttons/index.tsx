import React from 'react'
import { PeachScrollView } from '../../../components'
import tw from '../../../styles/tailwind'
import { GoBackButtons } from './GoBackButtons'
import { InfoButtons } from './InfoButtons'
import { OptionButtons } from './OptionButtons'
import { PrimaryButtons } from './PrimaryButtons'

export default () => (
  <PeachScrollView contentContainerStyle={tw`py-10 bg-primary-mild`}>
    <PrimaryButtons />
    <InfoButtons />
    <GoBackButtons />
    <OptionButtons />
  </PeachScrollView>
)
