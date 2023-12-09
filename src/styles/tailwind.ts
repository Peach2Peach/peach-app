import { NETWORK } from '@env'
import { create } from 'twrnc'

const tw = create(require(NETWORK === 'testnet' ? './tailwind.testnet.config' : './tailwind.config'))
export default tw
