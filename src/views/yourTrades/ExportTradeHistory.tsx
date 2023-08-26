import { Text, View } from 'react-native'
import RNFS from 'react-native-fs'
import Share from 'react-native-share'
import { NewHeader as Header, Screen } from '../../components'
import { NewButton as Button } from '../../components/buttons/Button'
import { useTradeSummaries } from '../../hooks/query/useTradeSummaries'
import { useShowErrorBanner } from '../../hooks/useShowErrorBanner'
import tw from '../../styles/tailwind'
import { writeFile } from '../../utils/file'
import i18n from '../../utils/i18n'
import { groupChars, priceFormat } from '../../utils/string'
import { getStatusCardProps } from './components/tradeItem/helpers'
import { getPastOffers } from './hooks/getPastOffers'
import { getThemeForTradeItem } from './utils'

export function ExportTradeHistory () {
  const { tradeSummaries } = useTradeSummaries()
  const handleError = useShowErrorBanner()

  const onPress = async () => {
    const destinationFileName = 'trade-history.csv'
    await writeCSV(getPastOffers(tradeSummaries), destinationFileName)

    Share.open({
      title: destinationFileName,
      url: `file://${RNFS.DocumentDirectoryPath}/${destinationFileName}`,
    }).catch(handleError)
  }

  return (
    <Screen>
      <Header title={i18n('exportTradeHistory.title')} />
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

function writeCSV (tradeSummaries: (OfferSummary | ContractSummary)[], destinationFileName: string) {
  let csvValue = 'Date, Trade ID, Type, Amount, Price\n'

  tradeSummaries.forEach((tradeSummary) => {
    const { amount } = tradeSummary
    const type = getTradeSummaryType(tradeSummary)
    const { title: tradeID, subtext: date } = getStatusCardProps(tradeSummary)
    const dateString = date.toLocaleString().replaceAll(',', '')

    const formattedAmount = groupChars(String(amount), 3)

    const tradePrice
      = 'price' in tradeSummary
        ? tradeSummary.currency === 'SAT'
          ? groupChars(String(tradeSummary.price), 3)
          : priceFormat(tradeSummary.price)
        : ''

    const price = 'price' in tradeSummary ? `${tradePrice} ${tradeSummary.currency}` : ''

    csvValue += `${dateString}, ${tradeID}, ${type}, ${formattedAmount}, ${price}\n`
  })

  return writeFile(`/${destinationFileName}`, csvValue)
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
