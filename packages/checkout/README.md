![Flitt](https://flitt.com/wp-content/uploads/2024/09/Group.svg)
# Flitt Checkout

### config
``` js
{
  options: {},
  params: {},
  hooks: {},
  button: {}, // button config 
  fields_custom: [],
  messages: {},
  validate: {},
  css_variable: {},
}
```

### options
Name                  | Type        | Default                 | Description                                                                         | Priority
---                   | ---         | ---                     | ---                                                                                 | ---
`methods`             | Array       | ['card']                | support `card`, `sepa`, `banks`, `receipt`.                                         |
`methods_disabled`    | Array       | []                      | support `card`, `sepa`, `banks`, `receipt`.                                         |
`wallet_methods_enabled`| Array     | ['apple', 'google']     | support `apple`, `google`.                                                          |
`card_icons`          | Array       | ['mastercard', 'visa']  | support `mastercard`, `visa`, `mir`, `prostir`, `diners`, `american_express` , `jcb`, `maestro`, `union_pay`.|
`banks_icons`         | Array       | []                      |                                                                                     |
`local_methods_icons` | Array       | []                      |                                                                                     |
`crypto_icons`        | Array       | []                      |                                                                                     |
`loans_icons`         | Array       | []                      |                                                                                     |
`emoney_icons`        | Array       | []                      |                                                                                     |
`wallets_icons`       | Array       | []                      |                                                                                     |
`title`               | String      |                         |                                                                                     | options or server
`link`                | String      |                         | format url                                                                          | server or options
`full_screen`         | Boolean     | true                    |                                                                                     |
`locales`             | Array       | [all]                   | support `cs`, `de`, `en`, `es`, `fr`, `hu`, `it`, `ko`, `lv`, `pl`, `ro`, `ru`, `sk`, `uk`.|
`api_domain`          | String      | 'pay.flitt.com'         |                                                                                     |
`endpoint`            | Object      |                         |                                                                                     |
`active_tab`          | String      | 'card'                  | support `card`, `sepa`.                                                             | GET parameters or server or options
`active_method`       | String      | ''                      |                                                                                     | GET parameters or server or options
`logo_url`            | String      |                         | format url                                                                          | options or server
`offerta_url`         | String      |                         | format url                                                                          | options or server
`default_country`     | String      |                         |                                                                                     |
`countries`           | Array       |                         |                                                                                     |
`theme`               | Object      |                         |                                                                                     |
`show_menu_first`     | Boolean     | false                   |                                                                                     |
`disable_request`     | Boolean     | false                   | no requests are sent to the server                                                  |
`subscription`        | Object      |                         |                                                                                     |
`loading`             | String      |                         | format url                                                                          |
`amount_readonly`     | Boolean     | true                    |                                                                                     |
`autosubmit`          | Boolean     | false                   |                                                                                     | GET parameters or options
`show_amount`         | Boolean     | true                    |                                                                                     |
`show_email`          | Boolean     | false                   |                                                                                     | server or options
`show_fee`            | Boolean     | true                    |                                                                                     |
`show_lang`           | Boolean     | true                    |                                                                                     |
`show_link`           | Boolean     | true                    |                                                                                     |
`show_order_desc`     | Boolean     | true                    |                                                                                     |
`show_pay_button_amount`| Boolean     | true                    | displaying the amount on the button                                                 |
`show_pay_button`     | Boolean     | true                    |                                                                                     |
`show_processed`      | Boolean     | true                    |                                                                                     |
`show_secure_message` | Boolean     | true                    |                                                                                     |
`show_test_mode`      | Boolean     | true                    |                                                                                     |
`show_title`          | Boolean     | true                    |                                                                                     |

### options.endpoint
Name                  | Type        | Default                                 | Description
---                   | ---         | ---                                     | ---
`gateway`             | String      | '/latest/checkout-v2/index.html'        |
`button`              | String      | '/latest/checkout-v2/button/index.html' |

### options.theme
Name                  | Type        | Default                 | Description
---                   | ---         | ---                     | ---
`type`                | String      | 'light'                 | support `light`, `dark`.
`preset`              | String      | 'black'                 | support `reset`, `black`, `silver`, `vibrant_silver`, `vibrant_gold`, `solid_black`, `black_and_white`, `euphoric_pink`, `heated_steel`, `nude_pink`, `tropical_gold`, `navy_shimmer`.
`layout`              | String      | 'default'               | support `default`, `plain`, `wallets_only`.

### options.subscription
Name                  | Type        | Default                 | Description
---                   | ---         | ---                     | ---
`type`                | String      | 'disable'               | support `disable`, `hidden`, `shown_edit_on`, `shown_edit_off`, `shown_readonly`
`periods`             | Array       | ['day', 'week', 'month']| support `day`, `week`, `month`.
`quantity`            | Boolean     | false                   |
`trial`               | Boolean     | false                   |
`unlimited`           | Boolean     | true                    |
`readonly`            | Boolean     | false                   |

### params
Name                  | Type        | Default                 | Description                 | Priority
---                   | ---         | ---                     | ---                         | ---
`merchant_id`         | Integer     | 1396424                 |                             |
`order_desc`          | String      |                         |                             | options or server
`amount`              | Integer     | null                    |                             |
`currency`            | String      | 'USD'                   |                             |
`response_url`        | String      |                         | format url                  |
`lang`                | String      | browser language        |                             | server or options
`required_rectoken`   | String      |                         | support `Y`, `N`, `y`, `n`. |
`verification`        | String      |                         | support `Y`, `N`, `y`, `n`. |
`verification_type`   | String      |                         | support `amount`, `code`    |
`token`               | String      |                         | length 40                   | GET parameters or options
`button`              | String      |                         | length 20-80                | GET parameters or options
`offer`               | Boolean     | false                   |                             |
`recurring_data`      | Object      |                         |                             |
`custom`              | Object      |                         |                             |
`customer_data`       | Object      |                         |                             |

#### params.recurring_data
Name                  | Type        | Default                 | Description
---                   | ---         | ---                     | ---
`every`               | Integer     | 1                       |
`period`              | String      | 'month'                 | support `day`, `week`, `month`.
`amount`              | Integer     | 0                       |
`end_time`            | String      |                         | format YYYY-MM-DD
`start_time`          | String      |                         | format YYYY-MM-DD
`quantity`            | Integer     | 0                       |
`trial_period`        | String      | ''                      |
`trial_quantity`      | Integer     | 0                       |

#### params.customer_data
Name                  | Type        | Default                 | Description
---                   | ---         | ---                     | ---
`customer_name`       | String      |                         |
`customer_address`    | String      |                         |
`customer_zip`        | String      |                         |
`customer_city`       | String      |                         |
`customer_country`    | String      |                         | dictionary countries
`customer_state`      | String      |                         |
`phonemobile`         | String      |                         | format phone
`email`               | String      |                         | format email

### hooks
| Name                 | Type        | Default                 | Description             | 
|----------------------| ---         | ---                     |-------------------------|
| `before_wallets_pay` | Function    |                         | must return a `Promise`.|

### messages
``` js
{
  messages: {
    {en}: {
      {id}: {value},
      ...
    },
    ...
  },
}
```

### validate
``` js
{
  validate: {
    {en}: {
      {id}: {value},
      ...
    },
    ...
  },
}
```

### css_variable
| Name            | Type    | Default | Description         |
|-----------------|---------|---------|---------------------|
| `border_radius` | Integer | 8       | from 0 to 24 pixels |


## Use
### $on
```
var app = checkout({css selector}, {config})

app.$on('success', function(model) {})
app.$on('error', function(model) {})
app.$on('ready', function(model) {})
app.$on('callback', function(model) {})
app.$on('show-pay', function(model) {})
```

### $emit
``` js
app.submit()
app.$emit('submit')

app.location({method}, {system})
app.$emit('location', {method}, {system})

app.setParams({params})
app.$emit('setParams', {params})

app.$emit('click-wallet')
app.$emit('click-wallet', 'google')
app.$emit('click-wallet', 'apple')
```

### Destroy app
```
app.$destroy()
app.$el.remove()
```

## Use validate

https://vee-validate.logaretm.com/v3/guide/rules.html#rules

support `after`, `alpha`, `date_format`, `decimal`, `digits`, `email`, `max`, `min`, `numeric`, `required`, `customer_field`, `phone`, `numrange`, `ccard`

``` html
<input-text name="email" validate="required|email"></input-text>
```

