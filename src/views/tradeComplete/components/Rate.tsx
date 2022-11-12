import React, { ReactElement, useContext, useState } from 'react'
import { Pressable, View } from 'react-native'

import { Button, Card, Text } from '../../../components'
import Icon from '../../../components/Icon'
import AppContext from '../../../contexts/app'
import { MessageContext } from '../../../contexts/message'
import tw from '../../../styles/tailwind'
import { getChatNotifications } from '../../../utils/chat'
import { createUserRating } from '../../../utils/contract'
import i18n from '../../../utils/i18n'
import { StackNavigation } from '../../../utils/navigation'
import { getOffer, getRequiredActionCount } from '../../../utils/offer'
import { rateUser } from '../../../utils/peachAPI'

type RateProps = ComponentProps & {
  contract: Contract
  view: 'seller' | 'buyer' | ''
  navigation: StackNavigation
  saveAndUpdate: (contract: Contract) => void
}

export default ({ contract, view, navigation, saveAndUpdate, style }: RateProps): ReactElement => {
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
      updateMessage({ msgKey: err.error || 'error.general', level: 'ERROR' })
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
      const offer = getOffer(contract.id.split('-')[view === 'seller' ? 0 : 1]) as BuyOffer | SellOffer
      navigation.replace('offer', { offer })
    } else {
      navigation.replace('yourTrades', {})
    }
  }
  return (
    <View style={style}>
      <Card style={tw`p-4`}>
        <Text style={tw`mt-2 text-grey-2 text-center`}>{i18n('rate.subtitle')}</Text>

        <View style={tw`mt-4 flex-row justify-center`}>
          <Pressable onPress={() => setVote('negative')}>
            <Icon
              id="negative"
              style={[tw`w-6 h-6 mx-2`, vote !== 'negative' ? tw`opacity-30` : {}]}
              color={tw`text-peach-1`.color as string}
            />
          </Pressable>
          <Pressable onPress={() => setVote('positive')}>
            <Icon
              id="positive"
              style={[tw`w-6 h-6 mx-2`, vote !== 'positive' ? tw`opacity-30` : {}]}
              color={tw`text-peach-1`.color as string}
            />
          </Pressable>
        </View>
      </Card>
      <View style={tw`mt-4 flex items-center`}>
        <Button title={i18n('rate.rateAndFinish')} disabled={!vote} wide={false} onPress={rate} />
      </View>
    </View>
  )
}
