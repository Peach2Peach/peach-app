import React, { ReactElement, useContext, useEffect, useState } from 'react'

import { account } from '../../utils/account'
import { StackNavigationProp } from '@react-navigation/stack'
import i18n from '../../utils/i18n'
import LanguageContext from '../../contexts/language'
import { MessageContext } from '../../contexts/message'
import AutoScan from './AutoScan'
import Manual from './Manual'
import Restored from './Restored'
import { View } from 'react-native'
import tw from '../../styles/tailwind'


type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'restoreBackup'>
type Props = {
  navigation: ProfileScreenNavigationProp;
}

// TODO
// 1. scan phone, gdrive, icloud for backup file
// (2. if no file found, ask for manual selection)
// 3. ask for password
// 4. backup restored > continue button
export default ({ navigation }: Props): ReactElement => {
  const [autoScanComplete, setAutoScanComplete] = useState(true)
  const [recoveredAccount, setRecoveredAccount] = useState(account)
  useContext(LanguageContext)
  const [, updateMessage] = useContext(MessageContext)

  useEffect(() => {
    setTimeout(() => {
      // TODO auto scan function
      setAutoScanComplete(true)
    }, 4000)
  }, [])


  const onError = () => {
    updateMessage({
      msg: i18n('form.password.invalid'),
      level: 'ERROR',
    })
  }

  return <View style={tw`px-6`}>
    {!autoScanComplete
      ? <AutoScan />
      : !recoveredAccount.publicKey
        ? <Manual
          navigation={navigation}
          onSuccess={(acc: Account) => setRecoveredAccount(acc)}
          onError={onError}
        />
        : <Restored navigation={navigation} />
    }
  </View>
}