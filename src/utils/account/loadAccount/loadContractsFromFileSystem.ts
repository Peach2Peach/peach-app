import { exists, readDir, readFile } from '../../file'
import { error } from '../../log'
import { dateTimeReviver, parseError } from '../../system'

/**
 * @deprecated
 */
export const loadContractsFromFileSystem = async (password: string): Promise<Account['contracts']> => {
  try {
    if (await exists('/peach-account-contracts')) {
      const contractFiles = await readDir('/peach-account-contracts')

      const contracts = await Promise.all(contractFiles.map((file) => readFile(file, password)))

      return contracts.map((contract) => JSON.parse(contract, dateTimeReviver))
    }

    // fallback to version 0.1.3
    let contracts = '[]'
    if (await exists('/peach-account-contracts.json')) {
      contracts = await readFile('/peach-account-contracts.json', password)
    }
    const parsedContracts = contracts ? (JSON.parse(contracts, dateTimeReviver) as Account['contracts']) : []

    return parsedContracts
  } catch (e) {
    error('Could not load contracts', parseError(e))
    return []
  }
}
