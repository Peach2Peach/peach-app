import { View } from 'react-native'
import { PopupComponent } from '../../components/popup/PopupComponent'
import PeachText from '../../components/text/Text'
import { ClosePopupAction } from '../../popups/actions'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

type Props = {
  error: string
}
const NodeConnectionErrorContent = ({ error }: Props) => (
  <PeachText selectable>{i18n('wallet.settings.node.error.text', error)}</PeachText>
)

export const NodeConnectionErrorPopup = ({ error }: Props) => (
  <PopupComponent
    title={i18n('wallet.settings.node.error.title')}
    content={<NodeConnectionErrorContent {...{ error }} />}
    actions={
      <View style={tw`w-full items-center`}>
        <ClosePopupAction textStyle={tw`text-black-1`} />
      </View>
    }
    bgColor={tw`bg-warning-background`}
    actionBgColor={tw`bg-warning-main`}
  />
)
