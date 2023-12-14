import { View } from 'react-native'
import { Text } from '../../components'
import { Screen } from '../../components/Screen'
import { Button } from '../../components/buttons/Button'
import { THOUSANDS_GROUP } from '../../constants'
import { useWriteCSV } from '../../hooks'
import { useTradeSummaries } from '../../hooks/query/useTradeSummaries'
import tw from '../../styles/tailwind'
import { sortByKey } from '../../utils/array/sortByKey'
import { toShortDateFormat } from '../../utils/date/toShortDateFormat'
import { createCSV } from '../../utils/file/createCSV'
import i18n from '../../utils/i18n'
import { groupChars } from '../../utils/string/groupChars'
import { priceFormat } from '../../utils/string/priceFormat'
import { getStatusCardProps } from './components/tradeItem/helpers'
import { getPastOffers, getThemeForTradeItem } from './utils'

export function ExportTradeHistory () {
  const { tradeSummaries } = useTradeSummaries()
  const openShareMenu = useWriteCSV()

  const onPress = async () => {
    const csvValue = createCSVValue(getPastOffers(tradeSummaries).sort(sortByKey('creationDate')))
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
  const headers = ['Date', 'Trade ID', 'Type', 'Amount', 'Price', 'Currency']
  const fields = {
    Date: (d: OfferSummary | ContractSummary) => toShortDateFormat(d.creationDate),
    'Trade ID': (d: OfferSummary | ContractSummary) => getStatusCardProps(d).title.replaceAll('‑', '-'),
    Type: getTradeSummaryType,
    Amount: (d: OfferSummary | ContractSummary) => {
      const { amount } = d
      return String(amount)
    },
    Price: (d: OfferSummary | ContractSummary) => {
      const tradePrice
        // eslint-disable-next-line max-len
        = 'price' in d ? (d.currency === 'SAT' ? groupChars(String(d.price), THOUSANDS_GROUP) : priceFormat(d.price)) : ''
      const price = 'price' in d ? `${tradePrice}` : ''
      return price
    },
    Currency: (d: OfferSummary | ContractSummary) => ('currency' in d ? d.currency : ''),
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
