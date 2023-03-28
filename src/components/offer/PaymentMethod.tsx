import { ReactElement, useMemo } from 'react'
import { Pressable } from 'react-native'
import { APPLINKS } from '../../constants'
import tw from '../../styles/tailwind'
import { getPaymentMethodName } from '../../utils/paymentMethod'
import { openAppLink } from '../../utils/web'
import Icon from '../Icon'
import { Text } from '../text'

type PaymentMethodProps = ComponentProps & {
  paymentMethod: PaymentMethod
  showLink: boolean
}

export const PaymentMethod = ({ paymentMethod, showLink, style }: PaymentMethodProps): ReactElement => {
  const url = APPLINKS[paymentMethod]?.url
  const appLink = APPLINKS[paymentMethod]?.appLink
  const openLink = () => (showLink && url ? openAppLink(url, appLink) : null)
  const name = useMemo(() => getPaymentMethodName(paymentMethod), [paymentMethod])
  return (
    <Pressable
      onPress={openLink}
      style={[
        tw`flex-row items-center px-2 rounded-lg`,
        showLink ? tw`bg-primary-main` : tw`border border-black-1`,
        style,
      ]}
    >
      <Text style={[tw`flex-wrap button-medium`, showLink && tw`text-primary-background-light`]}>{name}</Text>
      {!!url && showLink && (
        <Icon id="externalLink" style={tw`w-3 h-3 ml-1`} color={tw`text-primary-background-light`.color} />
      )}
    </Pressable>
  )
}
