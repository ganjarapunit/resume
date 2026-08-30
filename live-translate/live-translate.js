// Gemini 3.5 Live Translate — 60 min website client
// Audio in 16k PCM16 mono -> WebSocket -> translated audio 24k out + transcripts
// Uses contextWindowCompression: slidingWindow and sessionResumption handle to run unlimited

const els = {
  targetLang: document.getElementById('targetLang'),
  echo: document.getElementById('echo'),
  apiKey: document.getElementById('apiKey'),
  tokenServer: document.getElementById('tokenServer'),
  startBtn: document.getElementById('startBtn'),
  stopBtn: document.getElementById('stopBtn'),
  statusText: document.getElementById('statusText'),
  dot: document.getElementById('dot'),
  transcript: document.getElementById('transcript'),
  clearBtn: document.getElementById('clearBtn'),
  downloadBtn: document.getElementById('downloadBtn'),
  playAudio: document.getElementById('playAudio'),
};

let audioContext, workletNode, mediaStream, ws, isRunning = false;
let lastHandle = null; // for session resumption
let jitterQueue = [];
let audioOutCtx;

function logTranscript(who, text){
  const d = document.createElement('div');
  d.className = 'bubble ' + (who === 'you' ? 'you' : 'them');
  d.textContent = (who === 'you' ? 'You: ' : 'Translated: ') + text;
  els.transcript.appendChild(d);
  els.transcript.scrollTop = els.transcript.scrollHeight;
}

function setStatus(t, live=false){
  els.statusText.textContent = t;
  els.dot.classList.toggle('live', live);
}

function getEphemeralToken(){
  const url = els.tokenServer.value.trim();
  if(!url) return Promise.resolve(null);
  return fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ targetLanguageCode: els.targetLang.value, echo: els.echo.checked })
  }).then(async r=>{
    const j = await r.json();
    if(!r.ok) throw new Error(j.error?.message || JSON.stringify(j));
    console.log('Ephemeral token response', j);
    return j.token || j.ephemeralToken || j.name;
  });
}

function buildSetup(handle){
  return {
    setup: {
      model: 'models/gemini-3.5-live-translate-preview',
      generationConfig: {
        responseModalities: ['AUDIO'],
        translationConfig: {
          targetLanguageCode: els.targetLang.value,
          echoTargetLanguage: els.echo.checked
        }
      },
      // 60 min support
      contextWindowCompression: { slidingWindow: {} },
      sessionResumption: handle ? { handle } : {}
    }
  };
}

async function connect(handle){
  let token = await getEphemeralToken();
  let apiKey = els.apiKey.value.trim();
  if(!token && !apiKey){ setStatus('Paste API key or set token server', false); throw new Error('no auth'); }

  // Live API WebSocket endpoint, model is sent in setup, not in URL
  const base = 'wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent';
  const wsUrl = token
    ? `${base}?key=${encodeURIComponent(token)}`
    : `${base}?key=${encodeURIComponent(apiKey)}`;
  console.log('Connecting to', wsUrl.replace(/key=.*/, 'key=***'), 'with setup', buildSetup(handle));

  ws = new WebSocket(wsUrl);
  ws.onopen = () => {
    setStatus('Connected — streaming mic', true);
    ws.send(JSON.stringify(buildSetup(handle)));
    startMicCapture();
  };
  ws.onmessage = async (ev) => {
    let raw = ev.data;
    if (raw instanceof Blob) raw = await raw.text();
    console.log('WS message', raw.slice(0,800));
    const msg = JSON.parse(raw);
    if(msg.setupComplete) setStatus('Live — speak now', true);
    if(msg.sessionResumptionUpdate){
      console.log('Resumption update', msg.sessionResumptionUpdate);
      if(msg.sessionResumptionUpdate.resumable && msg.sessionResumptionUpdate.newHandle){
        lastHandle = msg.sessionResumptionUpdate.newHandle;
      }
    }
    if(msg.goAway){
      console.log('GoAway', msg.goAway);
      setStatus('Reconnecting (GoAway)...', true);
      reconnect();
      return;
    }
    if(msg.serverContent){
      if(msg.serverContent.modelTurn){
        const parts = msg.serverContent.modelTurn.parts || [];
        for(const p of parts){
          if(p.text) logTranscript('them', p.text);
          if(p.inlineData && els.playAudio.checked){
            playPcm24k(p.inlineData.data);
          }
        }
      }
      if(msg.serverContent.inputTranscription){
        logTranscript('you', msg.serverContent.inputTranscription.text);
      }
      if(msg.serverContent.outputTranscription && msg.serverContent.outputTranscription.text){
        logTranscript('them', msg.serverContent.outputTranscription.text);
      }
      if(msg.serverContent.interrupted) console.log('Interrupted');
      if(msg.serverContent.turnComplete) console.log('turnComplete');
    }
    if(msg.error) { console.error('Server error', msg.error); setStatus('Error: '+(msg.error.message||JSON.stringify(msg.error)), false); }
  };
  ws.onclose = (ev) => {
    console.log('WS close', ev.code, ev.reason);
    if(isRunning){
      setStatus('Reconnecting... code '+ev.code, true);
      setTimeout(()=> reconnect(), 800);
    }
  };
  ws.onerror = (e) => {
    console.error('WS error', e);
    setStatus('WebSocket error — check console', false);
  };
}

function reconnect(){
  if(!isRunning) return;
  try{ if(ws && ws.readyState===1) ws.close(); }catch(e){}
  stopMicCapture(false);
  setTimeout(()=> connect(lastHandle).catch(()=> setStatus('Reconnect failed', false)), 300);
}

function startMicCapture(){
  if(!audioContext){
    audioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
  }
  if(audioContext.state === 'suspended') audioContext.resume();
  // Use ScriptProcessor fallback if Worklet not available for brevity; use worklet when possible
  const source = audioContext.createMediaStreamSource(mediaStream);
  const processor = audioContext.createScriptProcessor(4096, 1, 1);
  let chunkCount = 0;
  processor.onaudioprocess = (e) => {
    if(!ws || ws.readyState !== 1) return;
    const input = e.inputBuffer.getChannelData(0);
    // 16k PCM16 base64
    const pcm16 = new Int16Array(input.length);
    for(let i=0;i<input.length;i++){ pcm16[i] = Math.max(-32768, Math.min(32767, input[i]*32768)); }
    const b64 = btoa(String.fromCharCode(...new Uint8Array(pcm16.buffer)));
    ws.send(JSON.stringify({ realtimeInput: { mediaChunks: [{ mimeType: 'audio/pcm;rate=16000', data: b64 }] } }));
    if(chunkCount++ % 50 === 0) console.log('Sent audio chunk', chunkCount, 'WS state', ws.readyState);
  };
  console.log('Mic capture started, sampleRate', audioContext.sampleRate, 'tracks', mediaStream.getTracks().map(t=>t.label));
  source.connect(processor);
  processor.connect(audioContext.destination);
  workletNode = processor;
}

function stopMicCapture(closeWs=true){
  if(workletNode){ try{ workletNode.disconnect(); }catch(e){} workletNode=null; }
  if(closeWs && ws){ try{ ws.close(); }catch(e){} ws=null; }
}

function playPcm24k(b64){
  if(!audioOutCtx) audioOutCtx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 });
  if(audioOutCtx.state==='suspended') audioOutCtx.resume();
  const bytes = Uint8Array.from(atob(b64), c=>c.charCodeAt(0));
  const pcm = new Int16Array(bytes.buffer);
  const buf = audioOutCtx.createBuffer(1, pcm.length, 24000);
  const ch = buf.getChannelData(0);
  for(let i=0;i<pcm.length;i++) ch[i] = pcm[i]/32768;
  const src = audioOutCtx.createBufferSource();
  src.buffer = buf;
  src.connect(audioOutCtx.destination);
  src.start();
}

async function start(){
  if(isRunning) return;
  const apiKey = els.apiKey.value.trim();
  const tokenServer = els.tokenServer.value.trim();
  if(!apiKey && !tokenServer){ alert('Paste your Gemini API key (free from AI Studio) or set a token server URL.'); return; }
  try{
    mediaStream = await navigator.mediaDevices.getUserMedia({ audio: { channelCount:1, sampleRate:16000, echoCancellation:true, noiseSuppression:true } });
  }catch(e){
    alert('Microphone permission denied or not on HTTPS. ' + e.message);
    return;
  }
  isRunning = true;
  lastHandle = null;
  els.startBtn.disabled = true;
  els.stopBtn.disabled = false;
  setStatus('Connecting...', true);
  await connect(null);
}

function stop(){
  isRunning = false;
  els.startBtn.disabled = false;
  els.stopBtn.disabled = true;
  setStatus('Idle', false);
  stopMicCapture(true);
  if(mediaStream){ mediaStream.getTracks().forEach(t=>t.stop()); mediaStream=null; }
  if(audioContext){ try{ audioContext.close(); }catch(e){} audioContext=null; }
}

els.startBtn.addEventListener('click', start);
els.stopBtn.addEventListener('click', stop);
els.clearBtn.addEventListener('click', ()=> els.transcript.innerHTML='');
els.downloadBtn.addEventListener('click', ()=>{
  const text = [...els.transcript.querySelectorAll('.bubble')].map(n=>n.textContent).join('\n');
  const blob = new Blob([text], {type:'text/plain'});
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'live-translation-transcript.txt'; a.click();
});
