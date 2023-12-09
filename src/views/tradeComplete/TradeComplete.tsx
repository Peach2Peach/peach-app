import { useEffect, useState } from 'react'
import { TouchableOpacity, View, ViewStyle } from 'react-native'
import { IconType } from '../../assets/icons'
import { Icon, Screen, Text } from '../../components'
import { Button } from '../../components/buttons/Button'
import { useRoute } from '../../hooks'
import { useContractDetails } from '../../hooks/query/useContractDetails'
import tw from '../../styles/tailwind'
import { useAccountStore } from '../../utils/account/account'
import { logTradeCompleted } from '../../utils/analytics'
import { getContractViewer } from '../../utils/contract'
import i18n from '../../utils/i18n'
import { LoadingScreen } from '../loading/LoadingScreen'
import { useRateSetup } from './hooks/useRateSetup'

export const TradeComplete = () => {
  const { contractId } = useRoute<'tradeComplete'>().params
  const { contract } = useContractDetails(contractId)
  if (!contract) return <LoadingScreen />

  return <TradeCompleteView contract={contract} />
}

function TradeCompleteView ({ contract }: { contract: Contract }) {
  const [vote, setVote] = useState<'positive' | 'negative'>()
  const account = useAccountStore((state) => state.account)
  const view = getContractViewer(contract, account)

  useEffect(() => {
    logTradeCompleted(contract)
  }, [])

  return (
    <Screen gradientBackground>
      <View style={tw`items-center justify-center grow`}>
        <View style={tw`justify-center gap-6 grow`}>
          <View style={tw`items-center`}>
            <Icon id="fullLogo" style={tw`w-311px h-127px`} />
            <Text style={tw`text-center h5 text-primary-background-light`}>
              {i18n(`tradeComplete.title.${view}.default`)}
            </Text>
          </View>

          <Text style={tw`text-center body-l text-primary-background-light`}>{i18n('rate.subtitle')}</Text>
          <View style={tw`flex-row justify-center gap-12`}>
            <RateButton
              onPress={() => setVote('negative')}
              iconId="thumbsDown"
              isSelected={vote === 'negative'}
              style={tw`pb-[13px] pt-[19px]`}
            />
            <RateButton
              onPress={() => setVote('positive')}
              iconId="thumbsUp"
              isSelected={vote === 'positive'}
              style={tw`pt-[13px] pb-[19px]`}
            />
          </View>
        </View>
        <Rate {...{ contract, view, vote }} />
      </View>
    </Screen>
  )
}

type RateButtonProps = {
  isSelected: boolean
  onPress: () => void
  iconId: IconType
  style: ViewStyle
}

function RateButton ({ isSelected, onPress, iconId, style }: RateButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        tw`items-center justify-center w-16 h-16 px-4`,
        tw`border-[3px] border-primary-background-light rounded-[21px]`,
        isSelected && tw`bg-primary-background-light`,
        style,
      ]}
    >
      <Icon id={iconId} size={32} color={isSelected ? tw.color('primary-main') : tw.color('primary-background-light')} />
    </TouchableOpacity>
  )
}

type RateProps = ComponentProps & {
  contract: Contract
  view: ContractViewer
  vote: 'positive' | 'negative' | undefined
}

function Rate ({ contract, view, vote }: RateProps) {
  const { rate, showTradeBreakdown } = useRateSetup({ contract, view, vote })

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
