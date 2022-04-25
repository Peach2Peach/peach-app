import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement } from 'react'
import { Pressable, View } from 'react-native'
import { Button } from '..'
import Icon from '../Icon'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'sell'|'buy'>

type NavigationProps = {
  screen: string,
  back: () => void,
  next: () => void,
  stepValid: boolean,
  offer?: BuyOffer|SellOffer,
}

export const Navigation = ({ screen, back, next, stepValid, offer }: NavigationProps): ReactElement => {
  let buttonText = i18n('next')
  if (offer && offer.type === 'ask' && screen === 'escrow' && !stepValid) {
    buttonText = offer.funding?.status === 'MEMPOOL'
      ? i18n('sell.escrow.waitingForConfirmation')
      : i18n('sell.escrow.fundToContinue')
  }
  if (/returnAddress|releaseAddress/u.test(screen)) buttonText = i18n('lookForAMatch')

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
  </View>
}

export default Navigation