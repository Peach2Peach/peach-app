export const isTradeComplete = (contract: Pick<Contract, 'paymentConfirmed'>) => !!contract.paymentConfirmed
