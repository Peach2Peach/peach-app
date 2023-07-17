import { useMemo } from 'react'
import { PeachScrollView } from '../../../components'
import { useHeaderSetup } from '../../../hooks'
import tw from '../../../styles/tailwind'
import { ConfirmSliderTests } from './ConfirmSliderTests'
import { PriceFormats } from './PriceFormats'
import { SatsFormats } from './SatsFormats'
import { StatusCards } from './StatusCards'
import { SummaryItems } from './SummaryItems'
import { UIComponents } from './UIComponents'
import { TransactionDetails } from './TransactionDetails'
import { Bubbles } from './Bubbles'

export const TestViewComponents = () => {
  useHeaderSetup(useMemo(() => ({ title: 'test view - components' }), []))

  return (
    <PeachScrollView
      style={tw`h-full`}
      contentContainerStyle={tw`flex items-center w-full px-6 py-10`}
      contentStyle={tw`gap-8`}
    >
      <SummaryItems />
      <TransactionDetails />
      <Bubbles />
      <ConfirmSliderTests />
      <UIComponents />
      <SatsFormats />
      <PriceFormats />
      <StatusCards />
      <SummaryItems />
    </PeachScrollView>
  )
}
