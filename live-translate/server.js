// Simple ephemeral token server for Gemini Live API translation
// Run: npm install express cors dotenv
//       GEMINI_API_KEY=your_key node server.js
// Deploy to Cloud Run / Vercel / any Node host. Keep your API key on the server only.

const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.GEMINI_API_KEY;
const PORT = process.env.PORT || 8080;

if(!API_KEY){
  console.warn('Set GEMINI_API_KEY env var (from AI Studio). Free tier works during preview.');
}

app.post('/api/live-token', async (req, res) => {
  const targetLanguageCode = req.body.targetLanguageCode || 'en';
  const echo = !!req.body.echo;

  // v1alpha ephemeral token creation. Lock translationConfig so client cannot tamper.
  const url = `https://generativelanguage.googleapis.com/v1alpha/ephemeralTokens?key=${API_KEY}`;
  const body = {
    config: {
      uses: 1,
      expireTime: new Date(Date.now() + 30*60*1000).toISOString(), // 30 min token
      newSessionExpireTime: new Date(Date.now() + 60*60*1000).toISOString(),
      liveEphemeralTokenConfig: {
        model: 'models/gemini-3.5-live-translate-preview',
        config: {
          generationConfig: {
            responseModalities: ['AUDIO'],
            translationConfig: { targetLanguageCode, echoTargetLanguage: echo }
          },
          // lock translationConfig on server
          lockAdditionalFields: ['generationConfig.translationConfig']
        }
      }
    }
  };

  // Allow client to choose language: use lock_additional_fields: []
  // If you want client-side choice, send { lockAdditionalFields: [] } instead and set translationConfig client-side.

  try{
    const r = await fetch(url, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) });
    const j = await r.json();
    if(!r.ok) return res.status(r.status).json(j);
    // j.token is the actual ephemeral token, j.name is the resource name
    const token = j.token || (j.name ? j.name.split('/').pop() : null) || j.name;
    res.json({ token, raw: j });
  }catch(e){
    res.status(500).json({ error: e.message });
  }
});

app.get('/health', (_,res)=> res.json({ ok:true }));

app.listen(PORT, ()=> console.log(`Token server on http://localhost:${PORT} — POST /api/live-token`));
