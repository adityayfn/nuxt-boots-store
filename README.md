# Nuxt Boots Store

This is a fake dr.martens boots store.
In this project I use firebase firestore, firebase authentication, and midtrans for payment gateway.

## Installation

Install Nuxt Boots Store with pnpm

```bash
  git clone https://github.com/adityayfn/nuxt-boots-store.git
  cd nuxt-boots-store
  pnpm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
pnpm run dev
```

## Production

Build the application for production:

```bash
pnpm run build
```

Locally preview production build:

```bash
pnpm run preview
```

## .env example

```javascript
//firebase credential
NUXT_API_KEY=
NUXT_AUTH_DOMAIN=
NUXT_DATABASE_URL=
NUXT_PROJECT_ID=
NUXT_STORAGE_BUCKET=
NUXT_MESSAGING_SENDERID=
NUXT_APP_ID=

//midtrans credential
NUXT_CLIENT_KEY=
NUXT_SERVER_KEY=
```

## Demo

https://fake-drmartens-store.netlify.app/

## Documentation

[Nuxt 3 documentation](https://nuxt.com/)

[Midtrans payment gateway](https://docs.midtrans.com/)

[Midtrans Client library](https://www.npmjs.com/package/midtrans-client)

[Virtual Account payment simulator](https://simulator.sandbox.midtrans.com/)

[Nuxt Scheduler for remove expired order](https://github.com/jurassicjs/nuxt-scheduler)
