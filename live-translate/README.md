# Live Translation for Website — Gemini 3.5 Live Translate

Real-time speech to speech translation for your 60 minute online lessons. No Meet extension needed.

**URL:** `/live-translate/` on your site (https://punitganjara.com/live-translate/)

## How 60 minutes works

* Audio only sessions are 15 min cap without config. We enable `contextWindowCompression: { slidingWindow: {} }` to evict old audio tokens and run unlimited duration.
* WebSocket connections live ~10 min. We enable `sessionResumption: {}` and store `SessionResumptionUpdate.newHandle`. On `GoAway` or close we reconnect with `{ sessionResumption: { handle } }`. Handles valid 2 hours.

## Quick start (free preview)

1. Get a free API key at https://aistudio.google.com (Gemini API, free tier during preview).
2. Open https://punitganjara.com/live-translate/ (or locally `live-translate/index.html` over HTTPS).
3. Paste the key, pick target language, click Start. Grant mic permission.

Input is audio only. Output is translated audio at 24kHz plus text transcript. Keep headphones on to avoid feedback.

## Production (do not ship your API key)

Deploy `server.js` to any Node host:

```
npm install express cors dotenv
GEMINI_API_KEY=your_key node live-translate/server.js
```

Point the page's `token server URL` to `https://your-host/api/live-token`. The page will then use ephemeral tokens and never expose your key.

If you want the client to choose the language, change the server to `lockAdditionalFields: []` and set `translationConfig` client side in the `setup` message.

## Embed as widget

```html
<script src="/live-translate/live-translate-widget.js" data-target-lang="vi"></script>
<div id="live-translate-root"></div>
```

The page `index.html` also doubles as a reusable widget. Copy its controls into any lesson page.

## Files

* `index.html` — UI and 60 min explanation
* `live-translate.js` — WebSocket client, 16k PCM capture, 24k playback, resumption + compression
* `server.js` — ephemeral token backend (v1alpha)
