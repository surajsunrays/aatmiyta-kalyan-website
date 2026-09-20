# Aatmiyata Kalyan

A responsive, accessible static NGO website with a soft ivory and olive palette, locally stored Buddha imagery, community celebrations, nursery information, and Vihar visitor information.

## Run

Requires Node.js. No dependencies to install.

```sh
npm run dev
```

Open http://localhost:5173. Set `PORT` to change the port. Run `npm run check` to validate JavaScript syntax. For deployment, serve `index.html`, `style.css`, `app.js`, and `assets/` using any static host. Google Fonts are optional; system fonts provide a fallback.

## Content

Edit page content in `index.html` and celebration detail text in `app.js`. Observance dates are not announced event schedules. The map links to the village rather than claiming an exact Vihar pin. Add verified contact details, programme timings, real activity photographs, and donation information when available. The home page does not collect personal data. The donation page previews donor details locally; see Donation page below. The hero image is illustrative AI-generated imagery, not a photograph of the NGO's actual Vihar.

## Image asset

Generated using the built-in image generation tool. Optimized website version: `assets/buddha.jpg`.

Final generation prompt:

> Use case: photorealistic-natural. Asset type: full-width hero background for a peace and Dhamma NGO website. Wide landscape 1536x1024 editorial photograph of a beautiful pale sandstone seated Buddha statue with serene face and closed eyes, statue occupies the right 45 percent of frame, upper body and crossed legs visible, surrounded by soft woodland foliage and a few delicate leaves. Left half is pale warm ivory mist with softly blurred trees, clear negative space for dark text. Quiet morning sunlight, muted sage olive greens, warm cream, subtle natural grain. Elegant, peaceful, realistic stone texture. No text, no logos, no watermarks.

## Verification

JavaScript syntax checks and internal anchor checks passed. In-app browser verification was unavailable in the development session; visual and interactive browser QA remains to be performed.

## Languages

Use the EN / मराठी header toggle to switch between English and Marathi. The preference is stored locally when browser storage is available. Static translations and celebration details live in `i18n.js`; keep them updated when changing English content. The toggle updates the document language, title, description, and accessibility labels. Devanagari font fallbacks are included for offline use.

## Dhamma card image

Generated with the built-in image generation tool. Optimized site asset: `assets/dhamma-buddha.jpg`. The card preserves the image’s 3:2 ratio to show the complete statue on desktop and mobile. This is illustrative imagery.

Final generation prompt:

> Use case: photorealistic-natural. Asset type: landscape image for a small NGO website card titled A home for Dhamma. Create a serene pale ivory sandstone seated Buddha statue, centered, complete head and crossed legs fully visible, generously framed with 20 percent clear breathing room above head and below pedestal. Wide landscape 3:2 composition. Statue occupies central half of frame, calm face with closed eyes, respectful traditional Buddhist sculpture. Softly blurred sage green garden foliage, warm cream stone ground, diffuse morning sunlight. Muted olive, ivory, warm white palette, quiet natural editorial photography, refined realistic stone texture. Image must remain nicely framed when cropped to a wide 1.7:1 card. No text, no logos, no watermark. Illustrative setting, not a specific real temple.

## Community tile portrait

Built-in image generation produced the illustrated Dr. Babasaheb Ambedkar portrait. Optimized site image: `assets/ambedkar.jpg`. Uses a 3:2 frame and an English/Marathi accessible label.

Final generation prompt:

> Create a respectful, recognizable painted portrait of Dr. Bhimrao Ramji Ambedkar (Dr. Babasaheb Ambedkar), Indian constitutional scholar and social reformer, with his distinctive round glasses, neatly combed black hair, clean-shaven face, blue suit, white shirt and tie, holding a plain closed book with no visible text. Landscape 3:2 composition for an NGO community website card. Chest-up portrait centered, full head visible with ample space above, dignified calm expression. Refined realistic editorial painting with subtle paper texture, warm ivory background and muted sage green hints, restrained blue suit. Peaceful, elegant and historically respectful, no decorative religious symbols, no text, no logos, no watermarks. Clearly an illustration, not an archival photograph.

## Nature tile image

Generated with the built-in image generation tool. Optimized website image: `assets/bodhi-tree.jpg`. The 3:2 frame matches the other tiles, with English and Marathi accessible labels. This is illustrative imagery.

Final generation prompt:

> Use case: photorealistic-natural. Asset: landscape 3:2 image for the nature tile of a peaceful Buddhist community NGO website. A beautiful sacred fig tree (Ficus religiosa, Bodhi tree), recognizable heart-shaped leaves with long tapering drip tips, graceful light gray trunk and spreading green canopy in a quiet Indian garden. Centered tree composition with generous breathing room, full crown and base visible. Soft morning light, subtle atmospheric background, warm ivory earth and muted sage olive green foliage. Refined natural editorial photography, realistic botanical details. Peaceful, understated and harmonious, matching pale sandstone Buddha imagery. No people, no text, no logos, no watermarks. Not a depiction of a specific actual NGO location.

## Current Jayanti image — supplied image cleanup

The Jayanti section now uses `assets/jai-bhim-clean.jpg`. Edited using the built-in image generation tool from the user's attached image. The full 1712:919 image is displayed without additional cropping.

Final edit prompt:

> Edit the attached user image. Remove the top-right Baba Play logo and watermark, the bottom-left circular camera/search overlay, and the bottom-left OFFICIAL VIDEO banner. Reconstruct those areas naturally from the surrounding warm yellow background and foreground dancers. Remove the thin black outer frame. Preserve Dr. Babasaheb Ambedkar's exact portrait, the dancers, the existing JAI JAI BHIM lettering, the original composition, warm yellow palette, and original photographic character. Do not replace or redraw the subject into a different portrait; make only the specified cleanup. Keep the same wide landscape aspect ratio.

## Donation page

Open `/donate.html` using `npm run dev`. The home page links to it from the header and involvement section. The page supports English and Marathi, validates name and amount (₹1–₹1,00,000, at most two decimal places), and accepts optional email/city. Only after submission does it generate a QR with the selected amount. Editing invalidates the previous QR.

### Demo and live setup

`donation-config.mjs` ships with `enabled: false` and an empty UPI ID. Sample QRs encode **plain demo text with the selected INR amount**, never a payment URI. They cannot initiate payment.

To enable real UPI requests later, set `upiId` to the NGO's bank-verified UPI address, confirm `payeeName`, then set `enabled: true`. Do not paste a static QR image: QRs are generated for each entered amount. The generated `upi://pay` URI includes `pa`, `pn`, `am`, `cu=INR`, a unique `tr`, and a generic donation note. Test the configured recipient and amount with the NGO's bank/payment provider before launch; syntactic validation cannot verify account ownership or app acceptance. See [Google's UPI field documentation](https://developers.google.com/pay/india/api/web/create-payment-method).

The QR uses the requested amount; a payment app may allow the donor to change it. This static site cannot enforce or verify the amount ultimately paid. It does not claim payment success, issue receipts, or promise tax benefits. Payment verification and donation records require a backend/payment provider integration.

Donor name/email/city remain in memory and form fields in this tab; they are not sent to a server, stored in localStorage, or included in the QR. Browser autofill may retain fields according to the visitor's own browser settings. Only the language preference is stored by the site.

QR encoding runs locally with vendored `qrcode-generator` 1.4.4 (`assets/qrcode-generator.js`, MIT license notice retained). No donor information is sent to a third-party QR service.

Run `npm run check` and `npm test`. Tests cover invalid amounts, decimal precision, donor validation, safe demo mode, live URI fields, and missing configuration. Browser visual QA was unavailable in this session.
