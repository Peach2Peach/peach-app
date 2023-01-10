import { fixBrokenOffersAndContracts } from './fixBrokenOffersAndContracts'

export const dataMigrationAfterLoadingAccount = async () => {
  fixBrokenOffersAndContracts()
}
