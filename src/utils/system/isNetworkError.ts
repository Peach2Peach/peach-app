const networkErrors = ['NETWORK REQUEST FAILED', 'ABORTED']
export const isNetworkError = (error: string) => networkErrors.includes(error.toUpperCase())
