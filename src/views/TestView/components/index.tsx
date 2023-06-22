import { useMemo } from 'react'
import { PeachScrollView } from '../../../components'
import { useHeaderSetup } from '../../../hooks'
import tw from '../../../styles/tailwind'
import { ConfirmSliderTests } from './ConfirmSliderTests'
import { PriceFormats } from './PriceFormats'
import { SatsFormats } from './SatsFormats'
import { SummaryItems } from './SummaryItems'
import { UIComponents } from './UIComponents'

export default () => {
  useHeaderSetup(useMemo(() => ({ title: 'test view - components' }), []))

  return (
    <PeachScrollView style={tw`h-full`} contentContainerStyle={tw`flex items-center w-full px-6 py-10`}>
      <ConfirmSliderTests />
      <UIComponents />
      <SatsFormats />
      <PriceFormats />
      <SummaryItems />
    </PeachScrollView>
  )
}
