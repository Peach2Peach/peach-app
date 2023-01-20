import React from 'react'
import { Pressable } from 'react-native'
import { Text } from '../../../components'
import { useMatchStore } from '../../../components/matches/store'
import { useCancelOffer } from '../../../hooks'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'

export const CancelOfferButton = () => {
  const offer = useMatchStore((state) => state.offer)
  const cancelOffer = useCancelOffer(offer)

  return (
    <Pressable style={tw`mt-3`} onPress={cancelOffer}>
      <Text style={tw`text-sm text-center underline uppercase font-baloo text-peach-1`}>{i18n('cancelOffer')}</Text>
    </Pressable>
  )
}
