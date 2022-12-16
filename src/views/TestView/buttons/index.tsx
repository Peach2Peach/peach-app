import React, { useMemo } from 'react'
import { GoBackButton, PeachScrollView } from '../../../components'
import { useHeaderSetup } from '../../../hooks'
import tw from '../../../styles/tailwind'
import { GoBackButtons } from './GoBackButtons'
import { InfoButtons } from './InfoButtons'
import { OptionButtons } from './OptionButtons'
import { PrimaryButtons } from './PrimaryButtons'

export default () => {
  useHeaderSetup(useMemo(() => ({ title: 'test view - buttons' }), []))
  return (
    <PeachScrollView
      style={tw`h-full bg-primary-mild-1`}
      contentContainerStyle={tw`w-full py-10 px-6 flex items-center`}
    >
      <PrimaryButtons />
      <InfoButtons />
      <GoBackButtons />
      <OptionButtons />
      <GoBackButton white wide style={tw`mt-8`} />
    </PeachScrollView>
  )
}
