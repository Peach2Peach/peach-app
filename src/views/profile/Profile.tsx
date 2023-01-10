import React, { ReactElement, useCallback, useState } from 'react'
import { Pressable, View } from 'react-native'

import tw from '../../styles/tailwind'

import Clipboard from '@react-native-clipboard/clipboard'
import { useFocusEffect } from '@react-navigation/native'
import shallow from 'zustand/shallow'
import { Fade, GoBackButton, Headline, Icon, Loading, PeachScrollView, Text, Title } from '../../components'
import { ExtraMedals, Rating, TradingLimit } from '../../components/user'
import { useRoute } from '../../hooks'
import { useBitcoinStore } from '../../store/bitcoinStore'
import { account, getTradingLimit } from '../../utils/account'
import i18n from '../../utils/i18n'
import { getUser } from '../../utils/peachAPI'
import { splitAt } from '../../utils/string'
import { toShortDateFormat } from '../../utils/date'

type UserTradeDetailsProps = {
  user: User
}

const UserTradeDetails = ({ user: { trades, disputes } }: UserTradeDetailsProps): ReactElement => (
  <View>
    <Text style={tw`text-center font-bold text-grey-1 mt-4`}>{i18n('profile.numberOfTrades')}</Text>
    <Text style={tw`text-center text-grey-1`}>{trades}</Text>

    <Text style={tw`text-center font-bold text-grey-1 mt-4`}>{i18n('profile.disputes')}</Text>
    <Text style={tw`text-center text-grey-1`}>
      {i18n('profile.disputesOpened')}: {disputes.opened}
    </Text>
    <Text style={tw`text-center text-grey-1`}>
      {i18n('profile.disputesWon')}: {disputes.won}
    </Text>
    <Text style={tw`text-center text-grey-1`}>
      {i18n('profile.disputesLost')}: {disputes.lost}
    </Text>
  </View>
)
export default (): ReactElement => {
  const route = useRoute<'profile'>()
  const [currency] = useBitcoinStore((state) => [state.currency], shallow)
  const { userId } = route.params
  const [updatePending, setUpdatePending] = useState(!route.params.user)
  const [showCopied, setShowCopied] = useState(false)
  const [user, setUser] = useState<User | undefined>(route.params.user)
  const isMyAccount = account.publicKey === userId
  const publicKey = splitAt(userId, Math.floor(userId.length / 2) - 1).join('\n')
  const now = new Date()
  const [accountAge, setAccountAge] = useState(0)

  useFocusEffect(
    useCallback(() => {
      ;(async () => {
        if (route.params.user) {
          const creationDate = new Date(route.params.user.creationDate)
          setUser(route.params.user)
          setAccountAge(Math.floor((now.getTime() - creationDate.getTime()) / (86400 * 1000)))

          setUpdatePending(false)
          return
        }
        setUpdatePending(true)
        const [response] = await getUser({ userId })

        if (response) {
          setUser(response)
          setAccountAge(Math.floor((now.getTime() - new Date(response.creationDate).getTime()) / (86400 * 1000)))
        }
        setUpdatePending(false)

        // TODO add error handling if request failed
      })()
    }, []),
  )

  const copy = () => {
    Clipboard.setString(userId)
    setShowCopied(true)
    setTimeout(() => setShowCopied(false), 500)
  }

  return (
    <View style={tw`h-full flex items-stretch`}>
      <PeachScrollView contentContainerStyle={tw`pt-6 px-12 pb-10`}>
        <Title title={i18n(isMyAccount ? 'profile.myAccount.title' : 'profile.user.title')} />
        <View style={tw`mt-12`}>
          <Headline style={tw`text-center text-grey-1 font-bold`}>Peach{userId.substring(0, 8)}</Headline>
          {user ? (
            user.trades < 3 ? (
              <View style={tw`flex items-center`}>
                <Text style={tw`font-bold font-baloo text-sm leading-4 ml-1 mt-2 text-grey-2`}>
                  {i18n('rating.newUser')}
                </Text>
              </View>
            ) : (
              <View style={tw`flex items-center`}>
                <Rating rating={user.rating} style={tw`mt-1`} />
                <ExtraMedals user={user} style={tw`mt-2`} />
              </View>
            )
          ) : null}

          <Text style={tw`text-center font-bold text-grey-1 mt-4`}>{i18n('profile.accountCreated')}</Text>
          <Text style={tw`text-center text-grey-1`}>
            {user ? toShortDateFormat(new Date(user.creationDate)) : ''} (
            {i18n('profile.daysAgo', accountAge.toString())})
          </Text>
          <Text style={tw`text-center text-grey-1 font-bold mt-4`}>{i18n('profile.publicKey')}</Text>
          <Pressable onPress={copy} style={tw`flex-row items-center justify-center`}>
            <Text style={tw`text-sm text-grey-2`}>{publicKey}</Text>
            <View>
              <Fade show={showCopied} duration={300} delay={0}>
                <Text
                  style={[
                    tw`absolute -top-6 w-20 left-1/2 -ml-10`,
                    tw`font-baloo text-grey-1 text-sm uppercase text-center`,
                  ]}
                >
                  {i18n('copied')}
                </Text>
              </Fade>
              <Icon id="copy" style={tw`w-7 h-7 ml-2`} color={tw`text-peach-1`.color} />
            </View>
          </Pressable>
          {isMyAccount ? <TradingLimit tradingLimit={getTradingLimit(currency)} style={tw`mt-4 px-2`} /> : null}
          {user ? <UserTradeDetails user={user} /> : null}
        </View>
        <GoBackButton style={tw`self-center mt-16`} />
      </PeachScrollView>
      {updatePending && (
        <View style={tw`w-full h-full items-center justify-center absolute`}>
          <Loading />
        </View>
      )}
    </View>
  )
}
