type feCallbackResponse = {
  invoiceNo: string;
  channelCode: string;
  respCode: string;
  respDesc: string;
};

type inquiryTokenResponse = {
  cardNo: string;
  cardToken: string;
  loyaltyPoints: any[] | null;
  merchantID: string;
  invoiceNo: string;
  amount: number;
  userDefined1: string;
  userDefined2: string;
  userDefined3: string;
  userDefined4: string;
  userDefined5: string;
  currencyCode: string;
  recurringUniqueID: string;
  tranRef: string;
  referenceNo: string;
  approvalCode: string;
  eci: string;
  transactionDateTime: string;
  agentCode: string;
  channelCode: string;
  issuerCountry: string;
  issuerBank: string;
  installmentMerchantAbsorbRate: number | null;
  cardType: string;
  idempotencyID: string;
  paymentScheme: string;
  respCode: string;
  respDesc: string;
};

type paymentTokenResponse = {
  webPaymentUrl: string;
  paymentToken: string;
  respCode: string;
  respDesc: string;
};
