import { NETWORK } from '@env'
import { create } from 'twrnc'

const tailwind = create(require(NETWORK === 'testnet' ? './tailwind.testnet.config' : './tailwind.config'))
export default tailwind
