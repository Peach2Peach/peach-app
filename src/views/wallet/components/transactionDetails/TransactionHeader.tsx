import { View } from 'react-native'
import { Text } from '../../../../components'
import { Bubble } from '../../../../components/bubble'
import { useIsMediumScreen, useNavigateToOfferOrContract } from '../../../../hooks'
import { useTradeSummaryStore } from '../../../../store/tradeSummaryStore'
import tw from '../../../../styles/tailwind'
import { contractIdToHex } from '../../../../utils/contract'
import i18n from '../../../../utils/i18n'
import { offerIdToHex } from '../../../../utils/offer'
import { TransactionIcon } from '../TransactionIcon'

type Props = ComponentProps & Pick<TransactionSummary, 'type' | 'offerId' | 'contractId'>
export const TransactionHeader = ({ type, offerId, contractId, style }: Props) => {
  const isMediumScreen = useIsMediumScreen()
  const tradeSummary = useTradeSummaryStore((state) =>
    contractId ? state.getContract(contractId) : offerId ? state.getOffer(offerId) : undefined,
  )
  const goToOffer = useNavigateToOfferOrContract(tradeSummary)
  const tradeId = contractId ? contractIdToHex(contractId) : offerId ? offerIdToHex(offerId) : undefined

  return (
    <View style={[tw`flex-row items-center gap-4`, tradeId && tw`items-end`, style]}>
      <TransactionIcon type={type} size={isMediumScreen ? 56 : 48} />
      <View style={tw`items-start flex-shrink`}>
        <Text style={[tw`h6`, tw.md`h5`]}>{i18n(`wallet.transactionDetails.type.${type}`)}</Text>
        {!!tradeId && (
          <Bubble color="primary-mild" iconId="info" onPress={goToOffer}>
            {tradeId}
          </Bubble>
        )}
      </View>
    </View>
  )
}
