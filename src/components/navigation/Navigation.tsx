import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement, useContext } from 'react'
import { Pressable, View } from 'react-native'
import { Button } from '..'
import Icon from '../Icon'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { Text } from '../text'
import ConfirmCancelTrade from '../../overlays/ConfirmCancelTrade'
import { OverlayContext } from '../../contexts/overlay'

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'sell'|'buy'>

type NavigationProps = {
  screen: string,
  back: () => void,
  next: () => void,
  navigation: ProfileScreenNavigationProp,
  stepValid: boolean,
  offer: BuyOffer|SellOffer,
}

export const Navigation = ({ screen, back, next, navigation, stepValid, offer }: NavigationProps): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)
  let buttonText = i18n('next')
  if (offer && offer.type === 'ask' && screen === 'escrow' && !stepValid) {
    buttonText = offer.funding?.status === 'MEMPOOL'
      ? i18n('sell.escrow.waitingForConfirmation')
      : i18n('sell.escrow.fundToContinue')
  }
  if (/returnAddress|releaseAddress/u.test(screen)) buttonText = i18n('lookForAMatch')

  const navigate = () => navigation.navigate('offers', {})

  const cancelTrade = () => updateOverlay({
    content: <ConfirmCancelTrade offer={offer} navigate={navigate} />,
    showCloseButton: false
  })

  return <View style={tw`w-full flex items-center`}>
    {!/main|escrow|search/u.test(screen)
      ? <Pressable style={tw`absolute left-0 z-10`} onPress={back}>
        <Icon id="arrowLeft" style={tw`w-10 h-10`} color={tw`text-peach-1`.color as string} />
      </Pressable>
      : null
    }
    <Button
      disabled={!stepValid}
      wide={false}
      onPress={stepValid ? next : () => {}}
      title={buttonText}
      loading={screen === 'escrow' && !stepValid}
      style={screen === 'escrow' && !stepValid && offer && offer.type === 'ask'
        ? offer.funding?.status === 'MEMPOOL' ? tw`w-72` : tw`w-56`
        : {}}
    />
    {screen === 'escrow'
      ? <Pressable style={tw`mt-4`} onPress={cancelTrade}>
        <Text style={tw`font-baloo text-sm text-peach-1 underline text-center uppercase`}>
          {i18n('cancelTrade')}
        </Text>
      </Pressable>
      : null
    }
  </View>
}

export default Navigation