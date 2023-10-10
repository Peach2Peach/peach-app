import { PeachScrollView } from '../../../components'
import tw from '../../../styles/tailwind'
import { Bubbles } from './Bubbles'
import { ConfirmSliderTests } from './ConfirmSliderTests'
import { PriceFormats } from './PriceFormats'
import { SatsFormats } from './SatsFormats'
import { StatusCards } from './StatusCards'
import { SummaryItems } from './SummaryItems'
import { TransactionDetails } from './TransactionDetails'
import { UIComponents } from './UIComponents'

export const TestViewComponents = () => (
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
