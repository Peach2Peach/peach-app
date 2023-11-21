import { View } from 'react-native'
import { Screen, Text } from '../../components'
import { Button } from '../../components/buttons/Button'
import { useWriteCSV } from '../../hooks'
import { useTradeSummaries } from '../../hooks/query/useTradeSummaries'
import tw from '../../styles/tailwind'
import { toShortDateFormat } from '../../utils/date'
import { createCSV } from '../../utils/file'
import i18n from '../../utils/i18n'
import { groupChars, priceFormat } from '../../utils/string'
import { getStatusCardProps } from './components/tradeItem/helpers'
import { getPastOffers, getThemeForTradeItem } from './utils'

const THOUSANDS_GROUP = 3

export function ExportTradeHistory () {
  const { tradeSummaries } = useTradeSummaries()
  const openShareMenu = useWriteCSV()

  const onPress = async () => {
    const csvValue = createCSVValue(getPastOffers(tradeSummaries))
    await openShareMenu(csvValue, 'trade-history.csv')
  }

  return (
    <Screen header={i18n('exportTradeHistory.title')}>
      <View style={tw`justify-center gap-8 grow`}>
        <Text style={tw`body-l`}>
          {`${i18n('exportTradeHistory.description')}

  • ${i18n('exportTradeHistory.date')}
  • ${i18n('exportTradeHistory.tradeID')}
  • ${i18n('exportTradeHistory.type')}
  • ${i18n('exportTradeHistory.amount')}
  • ${i18n('exportTradeHistory.price')}`}
        </Text>
      </View>
      <Button style={tw`self-center`} onPress={onPress}>
        {i18n('exportTradeHistory.export')}
      </Button>
    </Screen>
  )
}

function createCSVValue (tradeSummaries: (OfferSummary | ContractSummary)[]) {
  const headers = ['Date', 'Trade ID', 'Type', 'Amount', 'Price']
  const fields = {
    Date: (d: OfferSummary | ContractSummary) => toShortDateFormat(d.creationDate),
    'Trade ID': (d: OfferSummary | ContractSummary) => getStatusCardProps(d).title.replaceAll('‑', '-'),
    Type: getTradeSummaryType,
    Amount: (d: OfferSummary | ContractSummary) => {
      const { amount } = d
      return groupChars(String(amount), THOUSANDS_GROUP)
    },
    Price: (d: OfferSummary | ContractSummary) => {
      const tradePrice
        = 'price' in d ? (d.currency === 'SAT' ? groupChars(String(d.price), 3) : priceFormat(d.price)) : ''
      const price = 'price' in d ? `${tradePrice} ${d.currency}` : ''
      return price
    },
  }

  return createCSV(tradeSummaries, headers, fields)
}

function getTradeSummaryType (tradeSummary: OfferSummary | ContractSummary) {
  const { iconId } = getThemeForTradeItem(tradeSummary)
  const sellerLostDispute
    = iconId === 'alertOctagon' && 'disputeWinner' in tradeSummary && tradeSummary.disputeWinner === 'buyer'

  if (iconId === 'buy') {
    return 'bought'
  } else if (iconId === 'sell' || sellerLostDispute) {
    return 'sold'
  }
  return 'canceled'
}
