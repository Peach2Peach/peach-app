const networkErrors = ["NETWORK REQUEST FAILED", "NETWORK_ERROR", "ABORTED"];
export const isNetworkError = (error?: string | null) => {
  if (!error) return false;
  return networkErrors.includes(error.toUpperCase());
};
