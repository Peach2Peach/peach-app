import { error } from '../../../log'

export const handleMissingPeachAccount = () => {
  const authError = new Error('Peach Account not set')
  error(authError)
  throw authError
}
