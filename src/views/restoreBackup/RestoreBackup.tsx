import React, { ReactElement, useContext, useEffect, useState } from 'react'

import { View } from 'react-native'
import LanguageContext from '../../contexts/language'
import { MessageContext } from '../../contexts/message'
import tw from '../../styles/tailwind'
import { account } from '../../utils/account'
import i18n from '../../utils/i18n'
import { StackNavigation } from '../../utils/navigation'
import { ContactButton } from '../report/components/ContactButton'
import AutoScan from './AutoScan'
import Manual from './Manual'
import Restored from './Restored'

type Props = {
  navigation: StackNavigation;
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


  const onError = (e: Error) => {
    updateMessage({
      msgKey: e.message === 'AUTHENTICATION_FAILURE' ? e.message : 'form.password.invalid',
      level: 'ERROR',
    })
  }

  return <View>
    <ContactButton style={tw`p-4 absolute top-0 left-0 z-10`} navigation={navigation} />
    <View style={tw`px-6`}>
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
  </View>
}