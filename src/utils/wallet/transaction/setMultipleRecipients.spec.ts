import { ScriptAmount } from 'bdk-rn/lib/classes/Bindings'
import { addressScriptPubKeyMock, txBuildSetRecipientsMock } from '../../../../tests/unit/mocks/bdkRN'
import { buildTransaction } from './buildTransaction'
import { getScriptPubKeyFromAddress } from './getScriptPubKeyFromAddress'
import { setMultipleRecipients } from './setMultipleRecipients'

describe('setMultipleRecipients', () => {
  it('sets multiple recipients and splits amount in equal parts', async () => {
    const address = 'address'
    const addresses = ['address1', 'address2', 'address3']
    const amount = 21000000
    const scriptPubKey = 'scriptPubKey'
    const feeRate = 10

    addressScriptPubKeyMock.mockResolvedValueOnce(scriptPubKey)
    const transaction = await buildTransaction({ address, amount, feeRate })
    await setMultipleRecipients(transaction, amount, addresses)
    expect(txBuildSetRecipientsMock).toHaveBeenCalledWith([
      new ScriptAmount(await getScriptPubKeyFromAddress(addresses[0]), amount / addresses.length),
      new ScriptAmount(await getScriptPubKeyFromAddress(addresses[1]), amount / addresses.length),
      new ScriptAmount(await getScriptPubKeyFromAddress(addresses[2]), amount / addresses.length),
    ])
  })
})
