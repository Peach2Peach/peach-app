import { useEffect, useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { Icon, Text } from '../../components'
import { Button } from '../../components/buttons/Button'
import { useRoute } from '../../hooks'
import tw from '../../styles/tailwind'
import { account } from '../../utils/account'
import { logTradeCompleted } from '../../utils/analytics'
import { getContractViewer } from '../../utils/contract'
import i18n from '../../utils/i18n'
import { useRateSetup } from './hooks/useRateSetup'

export const TradeComplete = () => {
  const route = useRoute<'tradeComplete'>()
  const [contract, setContract] = useState<Contract>(route.params.contract)
  const view = getContractViewer(route.params.contract, account)

  const [vote, setVote] = useState<'positive' | 'negative'>()

  const saveAndUpdate = setContract

  useEffect(() => {
    logTradeCompleted(contract)
  }, [])

  return (
    <View style={tw`items-center justify-center h-full px-8 pt-5 pb-10`}>
      <View style={tw`justify-center gap-6 grow`}>
        <View style={tw`items-center`}>
          <Icon id="fullLogo" />
          <Text style={tw`text-center h5 text-primary-background-light`}>
            {i18n(`tradeComplete.title.${view}.default`)}
          </Text>
        </View>

        <Text style={tw`text-center body-l text-primary-background-light`}>{i18n('rate.subtitle')}</Text>
        <View style={tw`flex-row justify-center mt-4`}>
          <TouchableOpacity
            onPress={() => setVote('negative')}
            style={[
              tw`px-4 pb-[13px] pt-[19px] w-16 h-16 items-center justify-center mr-6`,
              tw`border-[3px] border-primary-background-light rounded-[21px]`,
              vote === 'negative' && tw`bg-primary-background-light`,
            ]}
          >
            <Icon
              id="thumbsDown"
              style={tw`w-8 h-8`}
              color={vote === 'negative' ? tw`text-primary-main`.color : tw`text-primary-background-light`.color}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setVote('positive')}
            style={[
              tw`px-4 pt-[13px] pb-[19px] w-16 h-16 items-center justify-center ml-6`,
              tw`border-[3px] border-primary-background-light rounded-[21px]`,
              vote === 'positive' && tw`bg-primary-background-light`,
            ]}
          >
            <Icon
              id="thumbsUp"
              style={tw`w-8 h-8`}
              color={vote === 'positive' ? tw`text-primary-main`.color : tw`text-primary-background-light`.color}
            />
          </TouchableOpacity>
        </View>
      </View>
      <Rate {...{ contract, view, vote, saveAndUpdate }} />
    </View>
  )
}

type Props = ComponentProps & {
  contract: Contract
  view: ContractViewer
  vote: 'positive' | 'negative' | undefined
  saveAndUpdate: (contract: Contract) => void
}

function Rate ({ contract, view, saveAndUpdate, vote }: Props) {
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
