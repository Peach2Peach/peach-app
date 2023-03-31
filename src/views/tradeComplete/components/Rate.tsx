import { ReactElement } from 'react'
import { View } from 'react-native'
import { PrimaryButton } from '../../../components'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { useRateSetup } from '../hooks/useRateSetup'

type Props = ComponentProps & {
  contract: Contract
  view: ContractViewer
  vote: 'positive' | 'negative' | undefined
  saveAndUpdate: (contract: Contract) => void
}

export const Rate = ({ contract, view, saveAndUpdate, vote, style }: Props): ReactElement => {
  const { rate, showTradeBreakdown } = useRateSetup({ contract, view, saveAndUpdate, vote, style })

  return (
    <View style={style}>
      <View style={[tw`mb-4`, !vote && tw`opacity-33`]}>
        <PrimaryButton onPress={rate} white>
          {i18n('rate.rateAndFinish')}
        </PrimaryButton>
      </View>

      {view === 'buyer' && (
        <PrimaryButton onPress={showTradeBreakdown} white border>
          {i18n('rate.tradeBreakdown')}
        </PrimaryButton>
      )}
    </View>
  )
}
