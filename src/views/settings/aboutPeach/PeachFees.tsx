import { Screen } from '../../../components/Screen'
import { BulletPoint } from '../../../components/text/BulletPoint'
import { PeachText } from '../../../components/text/PeachText'
import { useConfigStore } from '../../../store/configStore/configStore'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'

export const PeachFees = () => {
  const peachFee = useConfigStore((state) => state.peachFee)

  return (
    <Screen style={tw`justify-center`} header={i18n('settings.peachFees')}>
      <PeachText>
        {i18n('settings.fees.text.1')}
        <PeachText style={tw`text-primary-main`}> {(peachFee * 100).toString()}% </PeachText>
        {i18n('settings.fees.text.2')}
        {'\n'}
      </PeachText>
      <PeachText>
        {i18n('settings.fees.text.3')}
        {'\n'}
      </PeachText>
      <BulletPoint text={i18n('settings.fees.point.1')} />
      <BulletPoint text={i18n('settings.fees.point.2')} />
      <BulletPoint text={i18n('settings.fees.point.3')} />
    </Screen>
  )
}
