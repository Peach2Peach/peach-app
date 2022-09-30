import { exists } from 'react-native-fs'
import { mkdir, writeFile } from '../../file'
import { info } from '../../log'

/**
 * @description Method to save contracts
 * @param contracts contracts
 * @param password secret
 * @returns promise resolving to encrypted contracts
 */
export const storeContracts = async (contracts: Account['contracts'], password: string): Promise<void> => {
  info('Storing contracts', contracts.length)

  if (!(await exists('/peach-account-contracts'))) await mkdir('/peach-account-contracts')
  await Promise.all(
    contracts.map((contract) =>
      writeFile(`/peach-account-contracts/${contract.id}.json`, JSON.stringify(contract), password),
    ),
  )
}
