import { View } from 'react-native'
import tw from '../../../styles/tailwind'
import { showAddress } from '../../../utils/bitcoin'
import i18n from '../../../utils/i18n'
import Icon from '../../Icon'
import { TradeSeparator } from '../../offer/TradeSeparator'
import { Label } from '../../text'
import { ErrorBox } from '../../ui'
import { PriceInfo } from './PriceInfo'
import { NETWORK } from '@env'
import { Divider } from '../../Divider'

type Props = {
  match: Match
  offer: BuyOffer
}
export const BuyOfferMatchPrice = ({ match, offer }: Props) => (
  <View style={[tw`gap-1`, tw.md`gap-3`]}>
    <Divider text={i18n('price')} />
    <PriceInfo {...{ match, offer }} />
    {match.escrow ? (
      <Label
        testID="showEscrow"
        style={tw`border-primary-main absolute right-0 top-1/2`}
        onPress={() => showAddress(match.escrow, NETWORK)}
      >
        <Icon id="externalLink" style={tw`w-4 h-4`} color={tw`text-primary-main`.color} />
      </Label>
    ) : (
      <ErrorBox>Escrow not found</ErrorBox>
    )}
  </View>
)
