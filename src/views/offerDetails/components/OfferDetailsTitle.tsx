import { Text } from '../../../components'
import i18n from '../../../utils/i18n'
import { getHeaderStyles } from '../../../utils/layout'
import { offerIdToHex } from '../../../utils/offer'

type Props = {
  id: string
}

export const OfferDetailsTitle = ({ id }: Props) => {
  const { fontSize } = getHeaderStyles()
  return (
    <Text style={fontSize} numberOfLines={1}>
      {i18n('offer')} {offerIdToHex(id)}
    </Text>
  )
}
