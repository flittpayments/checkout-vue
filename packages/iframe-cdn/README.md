# Checkout Iframe CDN

CDN-hosted iframe application for Flitt Checkout.

This package builds a static iframe application that loads the Flitt Checkout frontend and provides communication with the parent window.

## Development

Generate local SSL certificates:

```bash
npm run certs:gen
```

Start HTTPS server:

```bash
npm run serve:ssl
```

Start Rollup in watch mode:

```bash
npm run dev
```
