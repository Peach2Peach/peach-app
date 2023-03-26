import { ReactElement } from 'react';
import { Text } from '../../components'
import i18n from '../../utils/i18n'

export const PaymentMethodsHelp = (): ReactElement => (
  <>
    <Text>{i18n('help.paymentMethods.description.1')}</Text>
    <Text>{i18n('help.paymentMethods.description.2')}</Text>
    {/* <View style={tw`flex-row items-center mt-2`}>
      <View style={tw`flex-shrink`}>
        <Text>{i18n('help.paymentMethods.description.2')}</Text>
      </View>
      <Icon style={tw`mx-3 w-7 h-7`} id="userCheck" color={tw`text-black-1`.color} />
    </View> */}
  </>
)
