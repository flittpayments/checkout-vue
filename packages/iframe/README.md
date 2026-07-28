# @flittpayments/checkout-iframe

JavaScript wrapper for embedding Flitt Checkout in an iframe.

## Module

### Installation

```bash
npm install @flittpayments/checkout-iframe
```

### Usage

```javascript
import { checkout } from '@flittpayments/checkout-iframe';

const app = checkout('#checkout-container', { ... });

app.$on('success', (data) => {
  console.log('Payment success', data);
});

app.$on('error', (data) => {
  console.log('Payment error', data);
});
```

## Vanilla JS

### Installation

```html
<script src="https://pay.flitt.com/latest/checkout-iframe/index.js"></script>
```

### Usage

```html
<script>
  const app = checkout('#checkout-container', { ... });

  app.$on('success', (data) => {
    console.log('Payment success', data);
  });

  app.$on('error', (data) => {
    console.log('Payment error', data);
  });
</script>
```

## API

### `checkout(container, config)`

Creates a checkout iframe inside the specified container.

#### Parameters

- `container`: Selector or DOM element.
- `config`: Configuration object.

#### Configuration

##### `options.fullscreen_payment_flow`

Type: `boolean`

Default: `true`

Controls how 3DS and wallet payment flows are displayed.

When set to `false`, 3DS challenge screens and Apple Pay SDK UI are rendered inside the checkout iframe instead of fullscreen mode.

All other configuration options are documented in the [@flittpayments/checkout documentation](https://github.com/flittpayments/checkout-vue/tree/latest/packages/checkout#config)

#### Returns

- `$on(event, handler)`: Subscribe to events (`success`, `error`, `ready`, `callback`, `show-pay`).
- `$emit(event, ...args)`: Send events to checkout (`submit`, `location`, `setParams`, `click-wallet`).
- `$destroy()`: Remove iframe and clean up listeners.

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

Open https://localhost:3000/demo.html in your browser to test the package locally.

The demo page loads the iframe application from the local iframe-cdn server running on port 3001.
