import { ReactElement } from 'react';

import CreateAccountError from './CreateAccountError'
import CreateAccountLoading from './CreateAccountLoading'
import CreateAccountSuccess from './CreateAccountSuccess'
import { useNewUserSetup } from './hooks/useNewUserSetup'

export default (): ReactElement => {
  const { success, error } = useNewUserSetup()
  if (success) return <CreateAccountSuccess />
  if (error) return <CreateAccountError err={error} />

  return <CreateAccountLoading />
}
