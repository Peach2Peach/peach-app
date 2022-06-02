import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { Button, Icon } from '../../../components'
import tw from '../../../styles/tailwind'

export default ({ style }: ComponentProps): ReactElement => {
  const addPaymentMethods = () => {}
  return <View style={style}>
    <View style={tw`flex items-center`}>
      <Button
        title={<Icon id="plus" style={tw`w-5 h-5`} color={tw`text-white-1`.color as string} />}
        wide={false}
        onPress={addPaymentMethods}
      />
    </View>
  </View>
}