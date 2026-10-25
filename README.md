# ICE Card

A private, offline emergency contact card you make in your browser. Save it as a phone lock-screen wallpaper, print a wallet card, or print an A4 sheet of cards for family members.

No account, no server, no tracking. The card is drawn locally with HTML, CSS, vanilla JavaScript and the Canvas API.

**Live site:** https://arovex.github.io/ice-card/

## What it does

- **Lock screen** — a 1170 × 2532 wallpaper with the top 30% and bottom 12% kept clear for the clock, flashlight and camera.
- **Wallet card** — a credit-card sized front and back (85.6 × 54 mm).
- **A4 print sheet** — four front-and-back pairs with cut lines.
- Four themes: Sunrise, Midnight, Sage and Clinic.
- Optional QR code carrying contact details as plain text, not a link.
- Export as PNG, copy to the clipboard, share (where supported), or print to paper/PDF.
- English and a partial right-to-left Urdu translation.

## Run it

Open `index.html` in a browser. No build step, package manager or server is required.

For the most reliable behaviour, serve the folder with any static file server rather than opening it from `file://`. Everything works offline once the page has loaded; web fonts fall back to local fonts.

## Privacy

- Every field is optional.
- The form is kept in memory by default. It is stored in `localStorage` only when **Remember on this device** is ticked.
- **Clear all my data** removes the saved form and settings.
- No analytics, uploads, accounts or network requests carrying card details.
- The only outside request is for optional Google Fonts.

A lock screen is visible to anyone holding the phone. The site warns about risky details and does not ask for a home address, full date of birth, ID numbers or bank credentials.

## Files

| Path | Purpose |
| --- | --- |
| `index.html` | Landing page |
| `create.html` | Form and live preview |
| `guide.html` | Setup instructions |
| `privacy.html` | Plain-language privacy details |
| `about.html` | Why the project exists and how it is built |
| `css/styles.css` | All site styles |
| `js/app.js` | Shared theme, language, navigation and storage |
| `js/strings.js` | Every interface string, including Urdu |
| `js/card.js` | Canvas drawing, layouts, QR encoder and fitting |
| `js/create.js` | Form, validation and export logic |

## A note on safety

This card is a convenience, not a medical record. It is not a medical device and does not call anyone for you. In an emergency, call your local emergency number first. Keep official records up to date and use your phone's built-in Medical ID or emergency information as well.

## License

Released under the [MIT License](LICENSE).

Copyright © 2026 arovex.

