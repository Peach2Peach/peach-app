import { useQuery } from '@tanstack/react-query'
import { View } from 'react-native'
import { LogoIcons } from '../../assets/logo'
import { Header, Icon, Screen, Text } from '../../components'
import { PeachyGradient } from '../../components/PeachyGradient'
import { Button } from '../../components/buttons/Button'
import { ProgressDonut } from '../../components/ui'
import { useNavigation } from '../../hooks'
import { useSelfUser } from '../../hooks/query/useSelfUser'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { peachAPI } from '../../utils/peachAPI'

export function Home () {
  return (
    <Screen showTradingLimit header={<Header showPriceStats />}>
      <View style={tw`items-center flex-1 gap-10px`}>
        <LogoIcons.homeLogo height={76} width={173} />
        <View style={tw`self-stretch flex-1 gap-10px`}>
          <DailyMessage />
          <MarketStats />
          <FreeTradesDonut />
        </View>
      </View>
      <View style={tw`flex-row gap-10px`}>
        <BuyButton />
        <SellButton />
      </View>
    </Screen>
  )
}

function FreeTradesDonut () {
  const { user } = useSelfUser()
  const freeTrades = user?.freeTrades || 0
  const maxFreeTrades = user?.maxFreeTrades || 0
  if (freeTrades === 0) return null
  return (
    <ProgressDonut
      style={tw`py-2`}
      title={i18n('settings.referrals.noPeachFees.freeTrades')}
      value={freeTrades}
      max={maxFreeTrades}
    />
  )
}

function DailyMessage () {
  const { data: message } = useQuery({
    queryKey: ['info', 'news'],
    queryFn: async () => {
      const { result, error } = await peachAPI.public.system.getNews()
      if (error || !result?.[0]) throw error || new Error('No message found')
      return result?.[0]
    },
  })
  if (!message) return null
  return (
    <View style={tw`overflow-hidden rounded-2xl`}>
      <PeachyGradient style={tw`absolute w-full h-full`} />
      <View style={tw`flex-row items-center self-stretch justify-center p-4 gap-10px`}>
        <Text style={tw`flex-1 text-center subtitle-1 text-primary-background-light`}>{message.text}</Text>
        <Icon id="share" color={tw.color('primary-background-light')} />
      </View>
    </View>
  )
}

function MarketStats () {
  const data = { openBuyOffers: 0, openSellOffers: 0, averagePremium: 0 }
  return (
    <View style={tw`items-center justify-center pb-4 gap-10px grow`}>
      <View style={tw`items-center gap-1`}>
        <Text style={tw`subtitle-0 text-success-main`}>{i18n('home.openBuyOffers', String(data.openBuyOffers))}</Text>
        <Text style={tw`subtitle-0 text-primary-main`}>{i18n('home.openSellOffers', String(data.openSellOffers))}</Text>
      </View>
      <Text style={tw`subtitle-1`}>
        {i18n('home.averagePremium')}:<Text style={tw`text-error-main subtitle-1`}> ~{data.averagePremium}%</Text>
      </Text>
    </View>
  )
}

const buttonStyle = tw`flex-1 px-5 py-3`

function BuyButton () {
  const navigation = useNavigation()
  const goToBuyOfferPreferences = () => navigation.navigate('buyOfferPreferences')
  return (
    <Button style={[buttonStyle, tw`bg-success-main`]} onPress={goToBuyOfferPreferences}>
      {i18n('buy')}
    </Button>
  )
}

function SellButton () {
  const navigation = useNavigation()
  const goToSellOfferPreferences = () => navigation.navigate('sellOfferPreferences')
  return (
    <Button style={[buttonStyle]} onPress={goToSellOfferPreferences}>
      {i18n('sell')}
    </Button>
  )
}