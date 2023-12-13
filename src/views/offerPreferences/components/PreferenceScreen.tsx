import { PeachScrollView, Screen } from '../../../components'
import tw from '../../../styles/tailwind'
import { BuyBitcoinHeader } from './BuyBitcoinHeader'

type Props = {
  children: React.ReactNode
  isSliding: boolean
  button: React.ReactNode
}

export function PreferenceScreen ({ children, button, isSliding }: Props) {
  return (
    <Screen header={<BuyBitcoinHeader />}>
      <PeachScrollView contentStyle={tw`gap-7`} scrollEnabled={!isSliding}>
        {children}
      </PeachScrollView>
      {button}
    </Screen>
  )
}
