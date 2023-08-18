import { Alert, View } from 'react-native'
import { NewHeader, Screen, Text } from '../../components'
import { NewButton as Button } from '../../components/buttons/Button'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

export const ExportTransactionHistory = () => {
  const onPress = () => {
    Alert.alert('Exporting transaction history is not yet supported')
  }

  return (
    <Screen>
      <NewHeader title={i18n('wallet.exportHistory.title')} />
      <View style={tw`justify-center gap-8 grow`}>
        <Text style={tw`body-l`}>
          {`${i18n('wallet.exportHistory.description')}
  \u2022 ${i18n('wallet.exportHistory.description.point1')}
  \u2022 ${i18n('wallet.exportHistory.description.point2')}
  \u2022 ${i18n('wallet.exportHistory.description.point3')}
  \u2022 ${i18n('wallet.exportHistory.description.point4')}`}
        </Text>
      </View>
      <Button style={tw`self-center`} onPress={onPress}>
        {i18n('wallet.exportHistory.export')}
      </Button>
    </Screen>
  )
}
