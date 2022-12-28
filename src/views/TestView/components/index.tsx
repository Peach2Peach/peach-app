import React, { useMemo } from 'react'
import { GoBackButton, PeachScrollView } from '../../../components'
import { useHeaderSetup } from '../../../hooks'
import tw from '../../../styles/tailwind'
import { PriceFormats } from './PriceFormats'
import { SatsFormats } from './SatsFormats'
import { SummaryItems } from './SummaryItems'

export default () => {
  useHeaderSetup(useMemo(() => ({ title: 'test view - components' }), []))

  return (
    <PeachScrollView style={tw`h-full`} contentContainerStyle={tw`w-full py-10 px-6 flex items-center`}>
      <SatsFormats />
      <PriceFormats />
      <SummaryItems />

      <GoBackButton white wide style={tw`mt-8`} />
    </PeachScrollView>
  )
}
