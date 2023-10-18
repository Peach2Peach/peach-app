import { View } from 'react-native'
import { Button } from '../../../components/buttons/Button'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { useRateSetup } from '../hooks/useRateSetup'

type Props = ComponentProps & {
  contract: Contract
  view: ContractViewer
  vote: 'positive' | 'negative' | undefined
  saveAndUpdate: (contract: Contract) => void
}

export const Rate = ({ contract, view, saveAndUpdate, vote }: Props) => {
  const { rate, showTradeBreakdown } = useRateSetup({ contract, view, saveAndUpdate, vote })

  return (
    <View style={tw`gap-3`}>
      <Button onPress={rate} style={tw`bg-primary-background-light`} disabled={!vote} textColor={tw`text-primary-main`}>
        {i18n('rate.rateAndFinish')}
      </Button>

      {view === 'buyer' && (
        <Button onPress={showTradeBreakdown} ghost>
          {i18n('rate.tradeBreakdown')}
        </Button>
      )}
    </View>
  )
}
