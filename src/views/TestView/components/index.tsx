import { useMemo } from 'react'
import { PeachScrollView } from '../../../components'
import { useHeaderSetup } from '../../../hooks'
import tw from '../../../styles/tailwind'
import { PriceFormats } from './PriceFormats'
import { SatsFormats } from './SatsFormats'
import { SlideToUnlockTests } from './SlideToUnlockTests'
import { SummaryItems } from './SummaryItems'
import { UIComponents } from './UIComponents'

export default () => {
  useHeaderSetup(useMemo(() => ({ title: 'test view - components' }), []))

  return (
    <PeachScrollView style={tw`h-full`} contentContainerStyle={tw`flex items-center w-full px-6 py-10`}>
      <UIComponents />
      <SatsFormats />
      <PriceFormats />
      <SummaryItems />
      <SlideToUnlockTests />
    </PeachScrollView>
  )
}
