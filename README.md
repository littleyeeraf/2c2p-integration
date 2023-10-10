# How to integrate

- Create JWT

```js
jwt({
  alg: "HS256",
  name: "jwt",
  secret: "2C2P_SECRET_KEY",
});
```

- Sign the token with these info

```js
const token = await jwt.sign({
  merchantID: "2C2P_MERCHANT_ID",
  invoiceNo: "0123456789",
  description: "Vespa",
  amount: "90000",
  currencyCode: "THB",
  frontendReturnUrl: "CALLBACK_URL",
});
```

- Send POST request to 2C2P with the token as payload

```js
const res = await fetch("2C2P_PAYMENT_URL", {
  method: "POST",
  headers: { "Content-type": "application/json; charset=UTF-8" },
  body: JSON.stringify({ payload: token }),
});
```

- Verify JWT and validate response

```js
const data = await res.json();
const payload = await jwt.verify(data.payload);
if (!payload) {
  return "Foo";
}
if (payload.respCode !== "0000") {
  return "Bar";
}
```

- Redirect to payment gateway

```js
set.redirect = payload.webPaymentUrl;
```

# Elysia with Bun runtime

## Getting Started

To get started with this template, simply paste this command into your terminal:

```bash
bun create elysia ./elysia-example
```

## Development

To start the development server run:

```bash
bun run dev
```

Open http://localhost:3000/ with your browser to see the result.
