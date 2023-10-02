import { PopupComponent } from '../../components/popup/PopupComponent'
import PeachText from '../../components/text/Text'
import { usePopupStore } from '../../store/usePopupStore'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { ClosePopupAction } from '../actions'
import { LoadingPopupAction } from '../actions/LoadingPopupAction'

type Props = {
  url: string
  save: () => void
}
const NodeConnectionSuccessContent = ({ url }: Pick<Props, 'url'>) => (
  <PeachText>{i18n('wallet.settings.node.success.text', url)}</PeachText>
)

const SaveAction = ({ save }: Pick<Props, 'save'>) => {
  const closePopup = usePopupStore((state) => state.closePopup)
  const onPress = () => {
    save()
    closePopup()
  }

  return (
    <LoadingPopupAction
      onPress={onPress}
      label={i18n('wallet.settings.node.success.confirm')}
      iconId={'save'}
      reverseOrder
    />
  )
}
export const NodeConnectionSuccessPopup = ({ url, save }: Props) => (
  <PopupComponent
    title={i18n('wallet.settings.node.success.title')}
    content={<NodeConnectionSuccessContent {...{ url }} />}
    actions={
      <>
        <ClosePopupAction />
        <SaveAction {...{ save }} />
      </>
    }
    bgColor={tw`bg-success-background`}
    actionBgColor={tw`bg-success-main`}
  />
)
