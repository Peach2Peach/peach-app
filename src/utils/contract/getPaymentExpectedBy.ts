const TWELVEHOURSINMS = 43200000;

export const getPaymentExpectedBy = (contract: Contract) =>
  contract.paymentExpectedBy
    ? contract.paymentExpectedBy.getTime()
    : contract.creationDate.getTime() + TWELVEHOURSINMS;
