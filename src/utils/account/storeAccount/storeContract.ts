import { exists } from 'react-native-fs'
import { mkdir, writeFile } from '../../file'
import { info } from '../../log'

/**
 * @description Method to save contract
 * @param contract contract
 * @param password secret
 * @returns promise resolving to encrypted contract
 */
export const storeContract = async (contract: Contract, password: string): Promise<void> => {
  info('Storing contract')

  if (!(await exists('/peach-account-contracts'))) await mkdir('/peach-account-contracts')
  await writeFile(`/peach-account-contracts/${contract.id}.json`, JSON.stringify(contract), password)
}
