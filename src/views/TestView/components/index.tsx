import { useMemo } from 'react'
import { PeachScrollView } from '../../../components'
import { useHeaderSetup } from '../../../hooks'
import tw from '../../../styles/tailwind'
import { PriceFormats } from './PriceFormats'
import { SatsFormats } from './SatsFormats'
import { SlideToUnlockTests } from './SlideToUnlockTests'
import { StatusCards } from './StatusCards'
import { UIComponents } from './UIComponents'
import { Bubbles } from './Bubbles'
import { SummaryItems } from './SummaryItems'

export default () => {
  useHeaderSetup(useMemo(() => ({ title: 'test view - components' }), []))

  return (
    <PeachScrollView
      style={tw`h-full`}
      contentContainerStyle={tw`flex items-center w-full px-6 py-10`}
      contentStyle={tw`gap-8`}
    >
      <SummaryItems />
      <Bubbles />
      <UIComponents />
      <SatsFormats />
      <PriceFormats />
      <StatusCards />
      <SlideToUnlockTests />
    </PeachScrollView>
  )
}
