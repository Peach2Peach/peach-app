import { useMemo } from 'react'
import { Pressable } from 'react-native'
import { APPLINKS } from '../../constants'
import tw from '../../styles/tailwind'
import { getPaymentMethodName } from '../../utils/paymentMethod'
import { openAppLink } from '../../utils/web'
import Icon from '../Icon'
import { Text } from '../text'

type Props = ComponentProps & {
  paymentMethod: PaymentMethod
  showLink: boolean
  isDispute: boolean
}

export const PaymentMethod = ({ paymentMethod, showLink, isDispute, style }: Props) => {
  const url = APPLINKS[paymentMethod]?.url
  const appLink = APPLINKS[paymentMethod]?.appLink
  const openLink = () => (showLink && url ? openAppLink(url, appLink) : null)
  const name = useMemo(() => getPaymentMethodName(paymentMethod), [paymentMethod])
  return (
    <Pressable
      onPress={openLink}
      style={[
        tw`flex-row items-center px-2 rounded-lg`,
        tw`border border-black-1`,
        isDispute && tw`border-error-light`,
        style,
      ]}
    >
      <Text style={[tw`flex-wrap button-medium`, isDispute && tw`text-error-light`]}>{name}</Text>
      {!!url && showLink && (
        <Icon
          id="externalLink"
          style={tw`w-3 h-3 ml-1`}
          color={isDispute ? tw`text-error-light`.color : tw`text-primary-background-light`.color}
        />
      )}
    </Pressable>
  )
}
