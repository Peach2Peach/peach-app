const networkErrors = ['NETWORK REQUEST FAILED', 'NETWORK_ERROR', 'ABORTED']
export const isNetworkError = (error: string) => networkErrors.includes(error.toUpperCase())
