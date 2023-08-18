import { useMemo } from 'react'
import { APPLINKS } from '../../paymentMethods'
import { getPaymentMethodName } from '../../utils/paymentMethod'
import { openAppLink } from '../../utils/web'
import { Bubble } from './Bubble'

type Props = ComponentProps & {
  paymentMethod: PaymentMethod
}

export const PaymentMethodBubble = ({ paymentMethod, ...props }: Props) => {
  const url = APPLINKS[paymentMethod]?.url
  const appLink = APPLINKS[paymentMethod]?.appLink
  const hasLink = !!(url || appLink)
  const openLink = () => (url ? openAppLink(url, appLink) : null)
  const name = useMemo(() => getPaymentMethodName(paymentMethod), [paymentMethod])
  return (
    <Bubble
      {...props}
      color="primary-mild"
      iconId={hasLink ? 'externalLink' : undefined}
      iconSize={12}
      onPress={hasLink ? openLink : undefined}
    >
      {name}
    </Bubble>
  )
}
