/* eslint-disable no-magic-numbers */
// import { BlockTime, Psbt, Transaction } from "bdk-rn";

// export const getTransactionDetails = (
//   amount = 10000,
//   feeRate = 1,
//   txId = "txId",
// ) => {
//   const psbt = new Psbt("base64");
//   const feeAmount = feeRate * 110;
//   psbt.feeRate = () => Promise.resolve(feeRate);
//   psbt.feeAmount = () => Promise.resolve(feeAmount);
//   psbt.txid = () => Promise.resolve(txId);

//   return {
//     psbt,
//     txDetails: new Transaction(
//       "txId",
//       0,
//       amount,
//       feeAmount,
//       new BlockTime(1, 1),
//       null,
//     ),
//   };
// };
