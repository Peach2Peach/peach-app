import {
  NodeState,
  Payment,
  PaymentDetailsVariant,
  PaymentStatus,
  PaymentType,
} from "@breeztech/react-native-breez-sdk";

export const nodeInfo: NodeState = {
  id: "nodeId",
  blockHeight: 1,
  channelsBalanceMsat: 200000000,
  onchainBalanceMsat: 21000000,
  pendingOnchainBalanceMsat: 0,
  utxos: [],
  maxPayableMsat: 200000000,
  maxReceivableMsat: 1000000000,
  maxSinglePaymentAmountMsat: 200000000,
  maxChanReserveMsats: 10000,
  connectedPeers: ["lsp1"],
  inboundLiquidityMsats: 1000000000,
};

export const lightningInvoice =
  "lnbc123450n1pj74nr2dqqpp5ksdzxv7azrj04vgthgksv0ymc90amv280ztf2tuec3x9md58mwnsxqrrsssp58hyyrfq38c8ztttuls2m0ntmwaqd9yulznxl54y7kyfra699pzsq9qrsgqcqzysrzjqtypret4hcklglvtfrdt85l3exc0dctdp4qttmtcy5es3lpt6uts6qqqqyqqqqqqqqqqqqlgqqqqqzsqyg60xfmxcswrsvjwma8wf000g60zn384whnczs33x9svt7k4z8vwlqjrk4p8xdu4a6r05safyjk792rlm7cwjj62585v6694nhy3xcfrcq4tl577";
export const lightningInvoiceNoAmount =
  "lnbc1pj7nm8tpp5ujtjwtumc3luvpkxscvwgjxyu53nwxutrr4ylrddczgtuvpgdqtqdq5g9kxy7fqd9h8vmmfvdjscqzzsxqyz5vqsp5q52lup6fgt5k3xw43mkwzn2j09ljcy6j4unsgwxtnc9tg9j6vvzq9qyyssq2c49gt3z2sc23ney3wvnyag5rz9smu06552ceskldrlzyddfrn64n7hpgn5hlfjtg28hy63uanunyzzm69w2t8f76a982pl3985dgacqpunxzd";
export const lnPayment: Payment = {
  id: "payment id",
  paymentType: PaymentType.SENT,
  paymentTime: 1,
  amountMsat: 12345,
  feeMsat: 12,
  status: PaymentStatus.COMPLETE,
  details: {
    type: PaymentDetailsVariant.LN,
    data: {
      paymentHash: "paymentHash",
      label: "label",
      destinationPubkey: "destinationPubkey",
      paymentPreimage: "paymentPreimage",
      keysend: false,
      bolt11: lightningInvoice,
    },
  },
};
