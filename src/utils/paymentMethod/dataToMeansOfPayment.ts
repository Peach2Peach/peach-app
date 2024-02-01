export const dataToMeansOfPayment = (
  mop: MeansOfPayment,
  data: PaymentData,
) => {
  (data.currencies || []).forEach((currency) => {
    if (!mop[currency]) mop[currency] = [];
    if (!mop[currency]?.includes(data.type)) mop[currency]?.push(data.type);
  });
  return mop;
};
