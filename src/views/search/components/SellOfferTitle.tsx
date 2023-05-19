import { Text } from '../../../components'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'

type Props = {
  plural?: boolean
}
export const SellOfferTitle = ({ plural = false }: Props) => (
  <Text style={[tw`text-center h6 text-primary-main`, tw.md`h4`]}>
    {i18n(`search.youGot${plural ? 'Matches' : 'AMatch'}`)}
  </Text>
)
