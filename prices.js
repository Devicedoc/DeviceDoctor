/* global window */
// Preisdaten aus dem PDF (Verkaufspreis in €).
// Datei ist bewusst "plain JS", damit sie überall ohne Build läuft.

(function () {
  /** @type {Record<string, {label: string, models: Record<string, {repairs: Record<string, number>}>}>} */
  const PRICE_DATA = {
    iphone: {
      label: "iPhone",
      models: {
        "iPhone SE (2./3. Gen)": { repairs: { Display: 110, Akku: 100, Ladeport: 60, Rückkamera: 210 } },
        "iPhone 11": { repairs: { Display: 160, Akku: 110, Ladeport: 100, Rückkamera: 80 } },
        "iPhone 11 Pro": { repairs: { Display: 150, Akku: 110, Ladeport: 70, Rückkamera: 280 } },
        "iPhone 12": { repairs: { Display: 140, Akku: 120, Ladeport: 90, Rückkamera: 130 } },
        "iPhone 12 Pro": { repairs: { Display: 140, Akku: 120, Ladeport: 90, Rückkamera: 200 } },
        "iPhone 13": { repairs: { Display: 150, Akku: 110, Ladeport: 140, Rückkamera: 80 } },
        "iPhone 13 Pro": { repairs: { Display: 170, Akku: 90, Ladeport: 220, Rückkamera: 270 } },
        "iPhone 14": { repairs: { Display: 150, Akku: 130, Ladeport: 170, Rückkamera: 200 } },
        "iPhone 14 Pro": { repairs: { Display: 180, Akku: 110, Ladeport: 200, Rückkamera: 280 } },
        "iPhone 15": { repairs: { Display: 150, Akku: 120, Ladeport: 150, Rückkamera: 170 } },
        "iPhone 15 Pro": { repairs: { Display: 200, Akku: 120, Ladeport: 170, Rückkamera: 240 } },
        "iPhone 16": { repairs: { Display: 250, Akku: 130, Ladeport: 80, Rückkamera: 100 } },
        "iPhone 16 Pro": { repairs: { Display: 420, Akku: 130, Ladeport: 180, Rückkamera: 260 } },
        "iPhone 17": { repairs: { Display: 630, Akku: 130, Ladeport: 80, Rückkamera: 310 } },
        "iPhone 17 Pro": { repairs: { Display: 680, Akku: 160, Ladeport: 180, Rückkamera: 430 } },
      },
    },
    galaxy: {
      label: "Samsung Galaxy",
      models: {
        "Galaxy S22": { repairs: { Display: 440, Akku: 110, Ladeport: 70, Rückkamera: 100 } },
        "Galaxy S23": { repairs: { Display: 170, Akku: 60, Ladeport: 70, Rückkamera: 70 } },
        "Galaxy S24": { repairs: { Display: 400, Akku: 100, Ladeport: 70, Rückkamera: 70 } },
        "Galaxy S23 Ultra": { repairs: { Display: 550, Akku: 100, Ladeport: 70, Rückkamera: 180 } },
        "Galaxy S24 Ultra": { repairs: { Display: 570, Akku: 90, Ladeport: 70, Rückkamera: 130 } },
      },
    },
    ipad: {
      label: "iPad",
      models: {
        "iPad Standard (ca.)": { repairs: { Display: 180, Akku: 100, Ladeport: 70, Rückkamera: 90 } },
        "iPad Air (ca.)": { repairs: { Display: 570, Akku: 200, Ladeport: 90, Rückkamera: 130 } },
        "iPad Pro (ca.)": { repairs: { Display: 950, Akku: 270, Ladeport: 100, Rückkamera: 160 } },
      },
    },
    macbook: {
      label: "MacBook",
      models: {
        "MacBook Air 2022–2025 (ca.)": { repairs: { Display: 880, Akku: 320, Ladeport: 140, Rückkamera: 280 } },
        "MacBook Pro 2022–2025 (ca.)": { repairs: { Display: 1180, Akku: 320, Ladeport: 130, Rückkamera: 310 } },
      },
    },
  };

  window.PRICE_DATA = PRICE_DATA;
})();

