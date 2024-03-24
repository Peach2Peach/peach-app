export const connect = jest.fn();
export const mnemonicToSeed = jest.fn();
export const defaultConfig = jest.fn();
export const nodeInfo = jest.fn();
export const receivePayment = jest.fn();
export const sendPayment = jest.fn();
export const listPayments = jest.fn();
export const paymentByHash = jest.fn();

export const EnvironmentType = {
  PRODUCTION: "production",
  STAGING: "staging",
};
export const NodeConfigVariant = {
  GREENLIGHT: "greenlight",
};

export const PaymentType = {
  SENT: "sent",
  RECEIVED: "received",
  CLOSED_CHANNEL: "closedChannel",
};
export const PaymentStatus = {
  PENDING: "pending",
  COMPLETE: "complete",
  FAILED: "failed",
};
export const PaymentDetailsVariant = {
  LN: "ln",
  CLOSED_CHANNEL: "closedChannel",
};
