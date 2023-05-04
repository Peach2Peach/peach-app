import { ReactElement, useMemo } from 'react'
import { View } from 'react-native'
import { Text } from '../../../components'
import { BulletPoint } from '../../../components/text'
import { useHeaderSetup } from '../../../hooks'
import { useConfigStore } from '../../../store/configStore'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'

export default (): ReactElement => {
  useHeaderSetup(useMemo(() => ({ title: i18n('settings.peachFees') }), []))
  const peachFee = useConfigStore((state) => state.peachFee)

  return (
    <View style={tw`items-start justify-center flex-1 p-8`}>
      <Text style={tw`body-m`}>
        {i18n('settings.fees.text.1')}
        <Text style={tw`body-m text-primary-main`}> {(peachFee * 100).toString()}% </Text>
        {i18n('settings.fees.text.2')}
        {'\n'}
      </Text>
      <Text style={tw`body-m`}>
        {i18n('settings.fees.text.3')}
        {'\n'}
      </Text>
      <BulletPoint text={i18n('settings.fees.point.1')} />
      <BulletPoint text={i18n('settings.fees.point.2')} />
      <BulletPoint text={i18n('settings.fees.point.3')} />
    </View>
  )
}
