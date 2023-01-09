import React, { ReactElement, useContext, useState } from 'react'
import { Pressable, View } from 'react-native'

import { Card, PrimaryButton, Text } from '../../../components'
import Icon from '../../../components/Icon'
import AppContext from '../../../contexts/app'
import { MessageContext } from '../../../contexts/message'
import { useNavigation } from '../../../hooks'
import tw from '../../../styles/tailwind'
import { getChatNotifications } from '../../../utils/chat'
import { createUserRating, getOfferIdFromContract } from '../../../utils/contract'
import i18n from '../../../utils/i18n'
import { getRequiredActionCount } from '../../../utils/offer'
import { rateUser } from '../../../utils/peachAPI'

type RateProps = ComponentProps & {
  contract: Contract
  view: 'seller' | 'buyer' | ''
  saveAndUpdate: (contract: Contract) => void
}

export default ({ contract, view, saveAndUpdate, style }: RateProps): ReactElement => {
  const navigation = useNavigation()
  const [, updateMessage] = useContext(MessageContext)
  const [, updateAppContext] = useContext(AppContext)

  const [vote, setVote] = useState('')

  const rate = async () => {
    if (!view) return

    const rating = createUserRating(
      view === 'seller' ? contract.buyer.id : contract.seller.id,
      vote === 'positive' ? 1 : -1,
    )
    const ratedUser = view === 'seller' ? 'ratingBuyer' : 'ratingSeller'

    const [, err] = await rateUser({
      contractId: contract.id,
      rating: rating.rating,
      signature: rating.signature,
    })

    if (err) {
      updateMessage({
        msgKey: err.error || 'GENERAL_ERROR',
        level: 'ERROR',
        action: {
          callback: () => navigation.navigate('contact'),
          label: i18n('contactUs'),
          icon: 'mail',
        },
      })
      return
    }
    saveAndUpdate({
      ...contract,
      [ratedUser]: true,
    })
    updateAppContext({
      notifications: getChatNotifications() + getRequiredActionCount(),
    })

    if (rating.rating === 1) {
      navigation.replace('offer', { offerId: getOfferIdFromContract(contract) })
    } else {
      navigation.replace('yourTrades')
    }
  }
  return (
    <View style={style}>
      <Card style={tw`p-4`}>
        <Text style={tw`mt-2 text-grey-2 text-center`}>{i18n('rate.subtitle')}</Text>

        <View style={tw`mt-4 flex-row justify-center`}>
          <Pressable onPress={() => setVote('negative')}>
            <Icon
              id="thumbsDown"
              style={[tw`w-6 h-6 mx-2`, vote !== 'negative' ? tw`opacity-30` : {}]}
              color={tw`text-peach-1`.color}
            />
          </Pressable>
          <Pressable onPress={() => setVote('positive')}>
            <Icon
              id="thumbsUp"
              style={[tw`w-6 h-6 mx-2`, vote !== 'positive' ? tw`opacity-30` : {}]}
              color={tw`text-peach-1`.color}
            />
          </Pressable>
        </View>
      </Card>
      <PrimaryButton style={tw`mt-4 self-center`} disabled={!vote} onPress={rate} narrow>
        title={i18n('rate.rateAndFinish')}
      </PrimaryButton>
    </View>
  )
}
