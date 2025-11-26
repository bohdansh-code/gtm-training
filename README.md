# GTM Training Shop

Простий демо-магазин для тренування роботи з **Google Tag Manager**:

- флоу покупки (start_purchase → payment → products → checkout → purchase)
- реєстрація користувача
- старт безкоштовного тріалу

## Структура

```text
gtm-training-shop/
├─ index.html
├─ src/
│  ├─ css/
│  │  └─ style.css
│  └─ js/
│     └─ main.js
└─ README.md
```

## Як використовувати

1. Відкрий `index.html` у браузері або задеплой на Netlify / GitHub Pages.
2. Додай свій контейнер **Google Tag Manager**:
   - `<script>` у `<head>`
   - `<noscript>` відразу після `<body>`.
3. У GTM створи Custom Event тригери для:
   - `start_purchase`
   - `payment_details_submitted`
   - `view_products`
   - `add_to_cart`
   - `begin_checkout`
   - `purchase`
   - `registration_submit`
   - `trial_start`
4. Повʼяжи тригери з GA4 / іншими тегами та тестуй у Preview mode.
