import { PeachText } from '../../../components/text/PeachText'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { ErrorPopup } from '../../ErrorPopup'
import { ClosePopupAction } from '../../actions/ClosePopupAction'

export function DisputeRaisedSuccess ({ view }: { view: ContractViewer }) {
  return (
    <ErrorPopup
      title={i18n('dispute.opened')}
      content={<PeachText>{i18n(`dispute.raised.text.${view}`)}</PeachText>}
      actions={<ClosePopupAction style={tw`justify-center`} />}
    />
  )
}
