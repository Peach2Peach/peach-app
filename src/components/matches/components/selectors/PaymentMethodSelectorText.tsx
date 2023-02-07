import React from 'react'
import { useMeetupEventsStore } from '../../../../store/meetupEventsStore'
import tw from '../../../../styles/tailwind'
import i18n from '../../../../utils/i18n'
import Icon from '../../../Icon'
import { Text } from '../../../text'

type Props = {
  isSelected: boolean
  isVerified: boolean
  name: string
}

export const PaymentMethodSelectorText = ({ isSelected, isVerified, name }: Props) => {
  const getMeetupEventName = useMeetupEventsStore((state) => state.getMeetupEventName)
  const paymentMethodName = name.includes('cash')
    ? getMeetupEventName(name.replace('cash.', ''))
    : i18n(`paymentMethod.${name}`)
  return (
    <>
      <Text style={[tw`self-center button-medium text-black-3`, isSelected && tw`text-primary-background-light`]}>
        {paymentMethodName}
      </Text>
      {isVerified && (
        <Icon
          id="userCheck"
          style={tw`w-3 h-3 ml-1`}
          color={isSelected ? tw`text-primary-background-light`.color : tw`text-black-3`.color}
        />
      )}
    </>
  )
}
