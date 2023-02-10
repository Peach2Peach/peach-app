export const shouldGoToContract = (error: APIError): error is APIError & { details: { contractId: string } } =>
  !!error.details
  && typeof error.details === 'object'
  && 'contractId' in error.details
  && typeof error.details.contractId === 'string'
