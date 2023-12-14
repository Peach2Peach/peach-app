import { Text } from '../../../components'
import { Screen } from '../../../components/Screen'
import { BulletPoint } from '../../../components/text'
import { useConfigStore } from '../../../store/configStore/configStore'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'

export const PeachFees = () => {
  const peachFee = useConfigStore((state) => state.peachFee)

  return (
    <Screen style={tw`justify-center`} header={i18n('settings.peachFees')}>
      <Text>
        {i18n('settings.fees.text.1')}
        <Text style={tw`body-m text-primary-main`}> {(peachFee * 100).toString()}% </Text>
        {i18n('settings.fees.text.2')}
        {'\n'}
      </Text>
      <Text>
        {i18n('settings.fees.text.3')}
        {'\n'}
      </Text>
      <BulletPoint text={i18n('settings.fees.point.1')} />
      <BulletPoint text={i18n('settings.fees.point.2')} />
      <BulletPoint text={i18n('settings.fees.point.3')} />
    </Screen>
  )
}
