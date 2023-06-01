import { TouchableOpacity, View } from 'react-native'
import { Icon, SatsFormat, Text } from '../../../components'
import { getPremiumColor } from '../../../components/matches/utils'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'

const getDisplayDate = (date: Date) => new Date(date).toLocaleDateString('en-GB')
  .split('/')
  .join(' / ')
type ContractSubtitleProps = {
  contract: Contract
  view: ContractViewer
  hasNewOffer: boolean
  goToNewOffer: () => void
}
export const ContractSubtitle = ({ contract, view, hasNewOffer, goToNewOffer }: ContractSubtitleProps) => {
  if (contract.tradeStatus === 'tradeCompleted') return (
    <View style={tw`flex-row items-center justify-center`}>
      <Text style={tw`text-center subtitle-1`}>
        {i18n('contract.tradeCompleted')} {getDisplayDate(contract.lastModified)}
      </Text>
      <Icon id="calendar" style={tw`w-6 h-6 ml-2`} color={tw`text-black-3`.color} />
    </View>
  )
  if (contract.tradeStatus === 'tradeCanceled') return (
    <>
      <View style={tw`flex-row items-center justify-center`}>
        <Text style={tw`text-center subtitle-1`}>
          {i18n('contract.tradeCanceled')} {getDisplayDate(contract.lastModified)}
        </Text>
        <Icon id="xCircle" style={tw`w-6 h-6 ml-2`} color={tw`text-black-3`.color} />
      </View>
      {hasNewOffer && (
        <TouchableOpacity style={tw`flex-row items-center justify-center mt-2`} onPress={goToNewOffer}>
          <Text style={tw`text-center underline tooltip text-black-2`}>{i18n('contract.goToNewOffer')}</Text>
          <Icon id="externalLink" style={tw`w-4 h-4 ml-1`} color={tw`text-primary-main`.color} />
        </TouchableOpacity>
      )}
    </>
  )
  const color = getPremiumColor(contract.premium || 0, false)
  return (
    <View style={tw`items-center`}>
      <Text style={tw`body-l text-black-2`}>
        {i18n(view === 'seller' ? 'contract.summary.youAreSelling' : 'contract.summary.youAreBuying')}
      </Text>
      <View style={tw`flex-row items-end`}>
        <SatsFormat
          sats={contract.amount}
          style={tw`text-2xl leading-3xl`}
          containerStyle={tw`-mt-1`}
          bitcoinLogoStyle={tw`w-4 h-4 mr-1`}
          satsStyle={tw`subtitle-1`}
        />
        {view === 'seller' && (
          <Text style={[tw`leading-loose body-l`, color]}>
            {' '}
            ({contract.premium > 0 ? '+' : ''}
            {String(contract.premium)}%)
          </Text>
        )}
      </View>
    </View>
  )
}
