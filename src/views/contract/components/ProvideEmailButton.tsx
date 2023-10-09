import { NewButton } from '../../../components/buttons/Button'
import { DisputeRaisedPopup } from '../../../popups/dispute/components/DisputeRaisedPopup'
import { usePopupStore } from '../../../store/usePopupStore'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { useContractContext } from '../context'

export const ProvideEmailButton = () => {
  const { contract, view } = useContractContext()
  const setPopup = usePopupStore((state) => state.setPopup)
  const onPress = () => setPopup(<DisputeRaisedPopup contract={contract} view={view} />)

  return (
    <NewButton style={tw`bg-error-main`} onPress={onPress} iconId="alertCircle">
      {i18n('contract.provideEmail')}
    </NewButton>
  )
}
