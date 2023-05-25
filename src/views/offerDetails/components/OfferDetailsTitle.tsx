import { Text } from '../../../components'
import { getHeaderStyles } from '../../../utils/layout'
import { offerIdToHex } from '../../../utils/offer'

type Props = {
  id: string
}

export const OfferDetailsTitle = ({ id }: Props) => {
  const { fontSize } = getHeaderStyles()
  return (
    <Text style={fontSize} numberOfLines={1}>
      {offerIdToHex(id)}
    </Text>
  )
}
