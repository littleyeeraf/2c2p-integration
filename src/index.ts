import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";

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

const app = new Elysia().use(
  jwt({
    alg: "HS256",
    name: "jwt",
    secret: Bun.env["2C2P_SECRET_KEY"],
  })
);

app.get("/", () => "Deez Buns");
app.get("/pay", async ({ jwt, set }) => {
  const token = await jwt.sign({
    merchantID: Bun.env["2C2P_MERCHANT_ID"],
    invoiceNo: Math.floor(Date.now() / 1000).toString(),
    description: "Vespa",
    amount: Math.ceil(Math.random() * 1000).toString(),
    currencyCode: "THB",
    frontendReturnUrl: `${Bun.env["BASE_URL"]}/callback`,
  });

  const res = await fetch(Bun.env["2C2P_PAYMENT_URL"], {
    method: "POST",
    headers: { "Content-type": "application/json; charset=UTF-8" },
    body: JSON.stringify({ payload: token }),
  });
  const data: { payload: string } = await res.json();
  const payload = <false | paymentTokenResponse>await jwt.verify(data.payload);
  if (!payload) {
    return "Foo";
  }
  if (payload.respCode !== "0000") {
    return "Bar";
  }

  return (set.redirect = payload.webPaymentUrl);
});

app.post(
  "/callback",
  async ({ body, jwt }) => {
    const resp = parseResponse(body.paymentResponse);
    const token = await jwt.sign({
      merchantID: Bun.env["2C2P_MERCHANT_ID"],
      invoiceNo: resp.invoiceNo,
      locale: "th",
    });

    const res = await fetch(Bun.env["2C2P_INQUIRY_URL"], {
      method: "POST",
      headers: { "Content-type": "application/json; charset=UTF-8" },
      body: JSON.stringify({ payload: token }),
    });
    const data: { payload: string } = await res.json();
    const payload = <false | inquiryTokenResponse>(
      await jwt.verify(data.payload)
    );
    if (!payload) {
      return "Foo";
    }
    if (payload.respCode !== "0000") {
      return "Bar";
    }
    console.log(payload);

    return "Welcome back!";
  },
  { body: t.Object({ paymentResponse: t.String() }) }
);

app.listen(6969);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

function parseResponse(res: string): feCallbackResponse {
  return JSON.parse(Buffer.from(res, "base64").toString());
}

declare module "bun" {
  interface Env {
    "2C2P_MERCHANT_ID": string;
    "2C2P_INQUIRY_URL": string;
    "2C2P_PAYMENT_URL": string;
    "2C2P_SECRET_KEY": string;
    BASE_URL: string;
  }
}
