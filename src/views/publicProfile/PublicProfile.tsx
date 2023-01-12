import Clipboard from '@react-native-clipboard/clipboard'
import { useFocusEffect } from '@react-navigation/native'
import React, { ReactElement, useCallback, useState } from 'react'
import { Pressable, View } from 'react-native'
import shallow from 'zustand/shallow'

import { Fade, GoBackButton, Headline, Icon, Loading, PeachScrollView, Text, Title } from '../../components'
import { ExtraMedals, Rating, TradingLimit } from '../../components/user'
import { useRoute } from '../../hooks'
import { useBitcoinStore } from '../../store/bitcoinStore'
import tw from '../../styles/tailwind'
import { account, getTradingLimit } from '../../utils/account'
import { toShortDateFormat } from '../../utils/date'
import i18n from '../../utils/i18n'
import { getUser } from '../../utils/peachAPI'
import { splitAt } from '../../utils/string'

type UserTradeDetailsProps = {
  user: User
}

const UserTradeDetails = ({ user: { trades, disputes } }: UserTradeDetailsProps): ReactElement => (
  <View>
    <Text style={tw`mt-4 font-bold text-center text-grey-1`}>{i18n('profile.numberOfTrades')}</Text>
    <Text style={tw`text-center text-grey-1`}>{trades}</Text>

    <Text style={tw`mt-4 font-bold text-center text-grey-1`}>{i18n('profile.disputes')}</Text>
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
  const route = useRoute<'publicProfile'>()
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
    <View style={tw`flex items-stretch h-full`}>
      <PeachScrollView contentContainerStyle={tw`px-12 pt-6 pb-10`}>
        <Title title={i18n(isMyAccount ? 'profile.myAccount.title' : 'profile.user.title')} />
        <View style={tw`mt-12`}>
          <Headline style={tw`font-bold text-center text-grey-1`}>Peach{userId.substring(0, 8)}</Headline>
          {user ? (
            user.trades < 3 ? (
              <View style={tw`flex items-center`}>
                <Text style={tw`mt-2 ml-1 text-sm font-bold leading-4 font-baloo text-grey-2`}>
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

          <Text style={tw`mt-4 font-bold text-center text-grey-1`}>{i18n('profile.accountCreated')}</Text>
          <Text style={tw`text-center text-grey-1`}>
            {user ? toShortDateFormat(new Date(user.creationDate)) : ''} (
            {i18n('profile.daysAgo', accountAge.toString())})
          </Text>
          <Text style={tw`mt-4 font-bold text-center text-grey-1`}>{i18n('profile.publicKey')}</Text>
          <Pressable onPress={copy} style={tw`flex-row items-center justify-center`}>
            <Text style={tw`text-sm text-grey-2`}>{publicKey}</Text>
            <View>
              <Fade show={showCopied} duration={300} delay={0}>
                <Text
                  style={[
                    tw`absolute w-20 -ml-10 -top-6 left-1/2`,
                    tw`text-sm text-center uppercase font-baloo text-grey-1`,
                  ]}
                >
                  {i18n('copied')}
                </Text>
              </Fade>
              <Icon id="copy" style={tw`ml-2 w-7 h-7`} color={tw`text-peach-1`.color} />
            </View>
          </Pressable>
          {isMyAccount ? <TradingLimit tradingLimit={getTradingLimit(currency)} style={tw`px-2 mt-4`} /> : null}
          {user ? <UserTradeDetails user={user} /> : null}
        </View>
        <GoBackButton style={tw`self-center mt-16`} />
      </PeachScrollView>
      {updatePending && (
        <View style={tw`absolute items-center justify-center w-full h-full`}>
          <Loading />
        </View>
      )}
    </View>
  )
}
