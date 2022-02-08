import React, { ReactElement } from 'react'
import { Pressable, View } from 'react-native'
import { Button } from '../../../components'
import Icon from '../../../components/Icon'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'

type NavigationProps = {
  screen: string,
  back: () => void,
  next: () => void,
  stepValid: boolean,
  loading: boolean,
}

export default ({ screen, back, next, stepValid, loading }: NavigationProps): ReactElement => {
  const buttonText = screen === 'escrow' && !stepValid
    ? i18n('sell.escrow.fundToContinue')
    : i18n('next')

  return <View style={tw`w-full flex items-center`}>
    {!/main|escrow/u.test(screen)
      ? <Pressable style={tw`absolute left-0 z-10`} onPress={back}>
        <Icon id="arrowLeft" style={tw`w-10 h-10`} color={tw`text-peach-1`.color as string} />
      </Pressable>
      : null
    }
    <Button
      style={!stepValid || loading ? tw`opacity-50` : {}}
      wide={false}
      onPress={stepValid || loading ? next : () => {}}
      title={buttonText}
    />
  </View>
}