export default {
  async fetch(request, env) {
    const allowedOrigins = [
      'https://punitganjara.com',
      'https://www.punitganjara.com',
      'https://ganjarapunit.github.io'
    ];
    const origin = request.headers.get('Origin');
    const allowOrigin = allowedOrigins.includes(origin) ? origin : 'https://punitganjara.com';
    const corsHeaders = {
      'Access-Control-Allow-Origin': allowOrigin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Accept',
      'Access-Control-Max-Age': '86400'
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ ok: false, error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const url = new URL(request.url);
    if (url.pathname.endsWith('/review')) {
      return handleReview(request, env, corsHeaders);
    }
    if (url.pathname.endsWith('/needs-analysis')) {
      return handleNeedsAnalysis(request, env, corsHeaders);
    }
    if (url.pathname.endsWith('/submission') || url.pathname.endsWith('/writing-submission')) {
      return handleSubmission(request, env, corsHeaders);
    }
    if (url.pathname.endsWith('/feedback') || url.pathname.endsWith('/ai-feedback')) {
      return handleFeedback(request, env, corsHeaders);
    }

    let data;
    try {
      data = await request.json();
    } catch (e) {
      return new Response(JSON.stringify({ ok: false, error: 'Invalid JSON' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const name = String(data.name || '').trim();
    const email = String(data.email || '').trim();
    const date = String(data.date || '').trim();
    const time = String(data.time || '').trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!name || !emailOk || !date || !time) {
      return new Response(JSON.stringify({ ok: false, error: 'Missing or invalid fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const ics = buildICS({ name, email, date, time });
    const attachment = [{ content: toBase64(ics), name: 'trial-lesson.ics' }];

    const teacherText = `New trial lesson request

Name: ${name}
Email: ${email}
Preferred date: ${date}
Preferred time: ${time} (HCMC, GMT+7)`;

    const teacherHtml = `<h2>New trial lesson request</h2>
<p><strong>Name:</strong> ${escapeHtml(name)}<br>
<strong>Email:</strong> ${escapeHtml(email)}<br>
<strong>Preferred date:</strong> ${escapeHtml(date)}<br>
<strong>Preferred time:</strong> ${escapeHtml(time)} (HCMC, GMT+7)</p>`;

    const learnerText = `Hi ${name},

Thank you for booking a trial lesson with me. It will take place on ${date} at ${time} (HCMC time, GMT+7) and lasts 40 minutes.
I have attached a calendar invitation to this email. Reply if you need to reschedule.

Looking forward to meeting you,
Punit Ganjara`;

    const learnerHtml = `<p>Hi ${escapeHtml(name)},</p>
<p>Thank you for booking a trial lesson with me. It will take place on <strong>${escapeHtml(date)}</strong> at <strong>${escapeHtml(time)}</strong> (HCMC time, GMT+7) and lasts 40 minutes.</p>
<p>I have attached a calendar invitation to this email. Reply if you need to reschedule.</p>
<p>Looking forward to meeting you,<br>Punit Ganjara</p>`;

    try {
      const teacherRes = await sendBrevo(env, {
        sender: { name: 'Trial Lesson Booking', email: 'punit@punitganjara.com' },
        to: [{ email: 'punit@punitganjara.com' }],
        replyTo: { email: email, name: name },
        subject: 'New trial lesson request from ' + name,
        textContent: teacherText,
        htmlContent: teacherHtml,
        attachment
      });
      if (!teacherRes.ok) {
        const detail = await teacherRes.text();
        return new Response(JSON.stringify({ ok: false, error: 'Teacher email failed', detail }),
          { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      const learnerRes = await sendBrevo(env, {
        sender: { name: 'Punit Ganjara', email: 'punit@punitganjara.com' },
        to: [{ email: email, name: name }],
        replyTo: { email: 'punit@punitganjara.com', name: 'Punit Ganjara' },
        subject: 'Your trial lesson with Punit Ganjara',
        textContent: learnerText,
        htmlContent: learnerHtml,
        attachment
      });
      if (!learnerRes.ok) {
        const detail = await learnerRes.text();
        return new Response(JSON.stringify({ ok: false, error: 'Learner email failed', detail }),
          { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
    } catch (e) {
      return new Response(JSON.stringify({ ok: false, error: 'Email send error' }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ ok: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
};

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

async function handleNeedsAnalysis(request, env, corsHeaders) {
  let data;
  try {
    data = await request.json();
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: 'Invalid JSON' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  const name = String(data.name || '').trim();
  const nativeLanguage = String(data.nativeLanguage || '').trim();
  const useEnglish = Array.isArray(data.useEnglish) ? data.useEnglish.map(String) : [];
  const mainGoal = String(data.mainGoal || '').trim();
  const timeline = String(data.timeline || '').trim();
  const ratings = data.ratings && typeof data.ratings === 'object' ? data.ratings : {};
  const fear = String(data.fear || '').trim();
  const studyPref = Array.isArray(data.studyPref) ? data.studyPref.map(String) : [];
  const feedback = String(data.feedback || '').trim();
  const topics = Array.isArray(data.topics) ? data.topics.map(String) : [];
  const contactEmail = String(data.contactEmail || '').trim();
  const phone = String(data.phone || '').trim();
  const contactPref = String(data.contactPref || '').trim();
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail);

  if (!name || !nativeLanguage || !useEnglish.length || !mainGoal || !timeline || !fear || !feedback || !emailOk) {
    return new Response(JSON.stringify({ ok: false, error: 'Missing or invalid fields' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
  if (studyPref.length > 3) {
    return new Response(JSON.stringify({ ok: false, error: 'Too many study preferences' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  const fmt = (arr) => arr.length ? arr.join(', ') : '—';
  const rateStr = 'Speaking: ' + (ratings.speaking || '—') + ', Listening: ' + (ratings.listening || '—') + ', Reading: ' + (ratings.reading || '—') + ', Writing: ' + (ratings.writing || '—') + ', Grammar: ' + (ratings.grammar || '—');

  const text = 'New Needs Analysis submission\n\n'
    + 'Name: ' + name + '\n'
    + 'Native language: ' + nativeLanguage + '\n'
    + 'Where use English: ' + fmt(useEnglish) + '\n'
    + 'Main goal: ' + mainGoal + '\n'
    + 'Timeline: ' + timeline + '\n'
    + 'Ratings: ' + rateStr + '\n'
    + 'Biggest fear: ' + fear + '\n'
    + 'Study preferences: ' + fmt(studyPref) + '\n'
    + 'Feedback pref: ' + feedback + '\n'
    + 'Topics: ' + fmt(topics) + '\n'
    + 'Contact email: ' + contactEmail + '\n'
    + 'Phone: ' + (phone || '—') + '\n'
    + 'Contact pref: ' + (contactPref || '—') + '\n'
    + 'Submitted: ' + String(data.submittedAt || '');

  const html = '<h2>New Needs Analysis</h2>'
    + '<p><strong>Name:</strong> ' + escapeHtml(name) + '<br>'
    + '<strong>Native language:</strong> ' + escapeHtml(nativeLanguage) + '<br>'
    + '<strong>Where use English:</strong> ' + escapeHtml(fmt(useEnglish)) + '<br>'
    + '<strong>Main goal:</strong> ' + escapeHtml(mainGoal) + '<br>'
    + '<strong>Timeline:</strong> ' + escapeHtml(timeline) + '<br>'
    + '<strong>Ratings:</strong> ' + escapeHtml(rateStr) + '<br>'
    + '<strong>Biggest fear:</strong> ' + escapeHtml(fear) + '<br>'
    + '<strong>Study preferences:</strong> ' + escapeHtml(fmt(studyPref)) + '<br>'
    + '<strong>Feedback:</strong> ' + escapeHtml(feedback) + '<br>'
    + '<strong>Topics:</strong> ' + escapeHtml(fmt(topics)) + '<br>'
    + '<strong>Contact email:</strong> ' + escapeHtml(contactEmail) + '<br>'
    + '<strong>Phone:</strong> ' + escapeHtml(phone || '—') + '<br>'
    + '<strong>Contact pref:</strong> ' + escapeHtml(contactPref || '—') + '</p>';

  try {
    const res = await sendBrevo(env, {
      sender: { name: 'Needs Analysis', email: 'punit@punitganjara.com' },
      to: [{ email: 'punit@punitganjara.com' }],
      replyTo: { email: contactEmail, name: name },
      subject: 'New Needs Analysis from ' + name,
      textContent: text,
      htmlContent: html
    });
    if (!res.ok) {
      const detail = await res.text();
      return new Response(JSON.stringify({ ok: false, error: 'Email send failed', detail }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: 'Email send error' }),
      { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  // Forward to Google Sheet webhook if configured (Apps Script Web App)
  if (env.GOOGLE_SHEET_WEBHOOK_URL) {
    try {
      await fetch(env.GOOGLE_SHEET_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch (e) {
      // Sheet failure should not block the main response; logged for debugging
      console.error('Sheet webhook failed', e);
    }
  }

  return new Response(JSON.stringify({ ok: true }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
}

async function handleSubmission(request, env, corsHeaders) {
  let data;
  try {
    data = await request.json();
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: 'Invalid JSON' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  // Support single submission or batch
  const submissions = Array.isArray(data.submissions) ? data.submissions : [data];
  const timestamp = new Date().toISOString();
  const results = [];

  for (const sub of submissions) {
    const name = String(sub.name || data.name || '').trim();
    const email = String(sub.email || data.email || '').trim();
    const lesson = String(sub.lesson || data.lesson || '').trim();
    const lessonTitle = String(sub.lessonTitle || data.lessonTitle || lesson).trim();
    const activityId = String(sub.activityId || data.activityId || '').trim();
    const activityTitle = String(sub.activityTitle || data.activityTitle || activityId).trim();
    const text = String(sub.text || data.text || '').trim();
    const activityType = String(sub.activityType || data.activityType || 'writing').trim();

    if (!name || !lesson || !text) {
      results.push({ ok: false, error: 'Missing name, lesson or text', activityId });
      continue;
    }
    if (text.length < 2) {
      results.push({ ok: false, error: 'Text too short', activityId });
      continue;
    }
    // Truncate very long texts for email (keep full for Sheet)
    const shortText = text.length > 2000 ? text.slice(0, 2000) + '…' : text;

    const emailOk = !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      results.push({ ok: false, error: 'Invalid email', activityId });
      continue;
    }

    const subject = `[Writing] ${name} — ${lessonTitle} — ${activityTitle}`;
    const textBody = `New writing submission

Name: ${name}
${email ? 'Email: ' + email + '\n' : ''}Lesson: ${lessonTitle} (${lesson})
Activity: ${activityTitle} (${activityId})
Type: ${activityType}
Time: ${timestamp}

Text:
${text}

---
View all submissions in your Google Sheet. Reply to this email to give feedback.`;

    const htmlBody = `<h2>New writing submission</h2>
<p><strong>Name:</strong> ${escapeHtml(name)}${email ? '<br><strong>Email:</strong> ' + escapeHtml(email) : ''}<br>
<strong>Lesson:</strong> ${escapeHtml(lessonTitle)} (${escapeHtml(lesson)})<br>
<strong>Activity:</strong> ${escapeHtml(activityTitle)} (${escapeHtml(activityId)})<br>
<strong>Type:</strong> ${escapeHtml(activityType)}<br>
<strong>Time:</strong> ${escapeHtml(timestamp)}</p>
<div style="background:#f4f6fb;border:2px solid #c9d4e6;border-radius:10px;padding:14px;white-space:pre-wrap;font-family:monospace;">${escapeHtml(text)}</div>
<p style="color:#5b6678;font-size:.9rem;">All submissions are also logged to your Google Sheet. Reply to give feedback.</p>`;

    try {
      const res = await sendBrevo(env, {
        sender: { name: 'EFL Writing Submission', email: 'punit@punitganjara.com' },
        to: [{ email: 'ganjarapunit@gmail.com', name: 'Punit Ganjara' }],
        replyTo: email ? { email: email, name: name } : { email: 'ganjarapunit@gmail.com', name: name },
        subject: subject,
        textContent: textBody,
        htmlContent: htmlBody
      });
      if (!res.ok) {
        const detail = await res.text();
        results.push({ ok: false, error: 'Email failed', detail, activityId });
        continue;
      }
    } catch (e) {
      results.push({ ok: false, error: 'Email send error', activityId });
      continue;
    }

    // Forward to Google Sheet webhook if configured
    if (env.GOOGLE_SHEET_WEBHOOK_URL) {
      try {
        await fetch(env.GOOGLE_SHEET_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            timestamp: timestamp,
            name: name,
            email: email,
            lesson: lesson,
            lessonTitle: lessonTitle,
            activityId: activityId,
            activityTitle: activityTitle,
            activityType: activityType,
            text: text,
            url: lesson
          })
        });
      } catch (e) {
        console.error('Sheet webhook failed', e);
      }
    }

    // Also optionally forward to a Google Docs webhook if configured
    if (env.GOOGLE_DOCS_WEBHOOK_URL) {
      try {
        await fetch(env.GOOGLE_DOCS_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            timestamp: timestamp,
            name: name,
            email: email,
            lesson: lesson,
            lessonTitle: lessonTitle,
            activityId: activityId,
            activityTitle: activityTitle,
            text: text
          })
        });
      } catch (e) {
        console.error('Docs webhook failed', e);
      }
    }

    results.push({ ok: true, activityId });
  }

  const allOk = results.every(r => r.ok);
  return new Response(JSON.stringify({ ok: allOk, results }),
    { status: allOk ? 200 : 207, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
}

/* ---------- Instant AI writing feedback (Gemini, server-side key) ---------- */

// Lesson-specific rubrics so feedback follows exactly what each lesson teaches.
function pickFeedbackRubric(lesson, activityId, activityTitle) {
  const l = String(lesson || '').toLowerCase();
  const a = String(activityId || '').toLowerCase();
  const t = String(activityTitle || '').toLowerCase();
  const where = l + ' ' + a + ' ' + t;
  if (where.includes('day02') || where.includes('overview')) {
    return 'IELTS Writing Task 1 OVERVIEW. Required structure: exactly 2 big trends, NO numbers at all, 1 to 2 sentences. '
      + 'Check: are there exactly 2 trends? Is there any number (must be zero)? Is it 1 to 2 lines?';
  }
  if (where.includes('day03') || where.includes('choose-data') || where.includes('choose data')) {
    return 'IELTS Writing Task 1 DETAILS. Required structure: only the important numbers (never every number), grouped and compared '
      + 'with words like while / compared to, past tense for finished years, prepositions at / to / from. '
      + 'Check: are numbers selected (not listed)? Is there a comparison? Is the past tense used?';
  }
  if (where.includes('day04') || where.includes('thesis') || where.includes('understand')) {
    return 'IELTS Writing Task 2 THESIS (1 to 2 lines). Required structure: position + 2 main points + direction. '
      + 'Discussion questions use WHILE plus your opinion. Problem questions use THIS ESSAY WILL and must NOT say I agree. '
      + 'Check: is there a clear position? Are there 2 points? Is there a direction (so/overall)? Is the wrong frame used (e.g. I agree in a Problem thesis)?';
  }
  if (where.includes('day05') || where.includes('start') || where.includes('paraphrase') || where.includes('conclusion')) {
    return 'IELTS Writing Task 2 INTRODUCTION + CONCLUSION. Required structure: introduction = paraphrase the question '
      + '(change most words, keep key words) + thesis; conclusion = restate your opinion starting with IN CONCLUSION, no new ideas. '
      + 'Check: is the question copied (must be paraphrased)? Is the opinion restated at the end? Is there any new idea in the conclusion (must be zero)?';
  }
  if (where.includes('day06') || where.includes('peel')) {
    return 'PEEL PARAGRAPH (4 to 5 lines, ONE idea only, explained deeply). Required structure: P = one clear Point, '
      + 'E = Evidence starting with FOR EXAMPLE, E = Explain starting with THIS, L = Link back with EVEN SO or THEREFORE. '
      + 'Check: is there exactly 1 idea (not a list)? Is there FOR EXAMPLE? Is there an Even so / Therefore link?';
  }
  if (where.includes('day07') || where.includes('link') || where.includes('tone')) {
    return 'LINKING + FORMAL TONE. Required structure: maximum 1 big linker, reference with THIS / SUCH + noun, '
      + 'join inside sentences with which / because / while, formal words only (no stuff, no contractions: write do not, cannot). '
      + 'Check: are there 2 or more big linkers (must be max 1)? Is there a This/Such reference? Any informal word or contraction?';
  }
  if (where.includes('day09') || where.includes('full-test') || where.includes('full test') || where.includes('mock')) {
    return 'FULL IELTS WRITING TASK 2 MOCK (40 minutes, 250+ words). Required structure: introduction = paraphrase + thesis '
      + '(position + 2 points), 2 PEEL body paragraphs (ONE idea each: Point, FOR EXAMPLE evidence, THIS explanation, EVEN SO or THEREFORE link), '
      + 'conclusion restating the opinion with IN CONCLUSION and no new ideas. Plus: max 1 big linker, formal words (no contractions), '
      + 'natural pairs (argue THAT, AT your own pace, REDUCE stress), zero top errors (This HELPS). '
      + 'Check: is it 250+ words? Are there 4 parts? Is each body ONE idea with PEEL links? Any copied question words, informal words, or top errors?';
  }
  if (where.includes('day08') || where.includes('pairs') || where.includes('collocation')) {
    return 'NATURAL WORDS + SENTENCES. Required structure: natural collocations (argue THAT, AT your own pace, REDUCE stress), '
      + 'joined sentences with so / but / because / which / While, zero top errors (This HELPS not This help). '
      + 'Check: is there an unnatural pair? Is there a top error (subject-verb, article)? Are sentences joined or choppy?';
  }
  return 'IELTS Writing (Task 1 or Task 2). Check: does the text answer the question? Is there a clear overview or position? '
    + 'Are ideas grouped and linked? Are there repeated grammar errors?';
}

function buildFeedbackPrompt(rubric, text, activityTitle, lessonTitle) {
  return 'You are Punit, a friendly EFL writing coach. Your learner is Annisa, a Vietnamese adult at B1-B2 level preparing for IELTS.\n'
    + 'Lesson: ' + lessonTitle + '. Task: ' + activityTitle + '.\n'
    + 'The lesson requires exactly this structure:\n' + rubric + '\n'
    + 'Give short, encouraging feedback a B1-B2 learner can act on immediately, in exactly this shape:\n'
    + 'Good: one specific thing that matches the lesson structure (1 line).\n'
    + 'Fix: up to 2 problems, each tied to the lesson structure above (1 line each). Ignore anything outside this lesson focus.\n'
    + 'Try: rewrite ONLY the weakest sentence, keeping the learner ideas, in 1 to 2 lines.\n'
    + 'Rules: plain text only, no markdown, no hashtags, under 120 words total. Never add new ideas the learner did not write. '
    + 'If the text is too short or off-task, say so in one line and stop.\n'
    + 'Learner text:\n' + text;
}

// Light in-memory throttle (best effort, per isolate) to protect the paid API.
const feedbackHits = new Map();
function feedbackAllowed(ip) {
  const now = Date.now();
  const windowMs = 5 * 60 * 1000;
  const maxHits = 8;
  let hits = feedbackHits.get(ip) || [];
  hits = hits.filter(function (ts) { return now - ts < windowMs; });
  if (hits.length >= maxHits) {
    feedbackHits.set(ip, hits);
    return false;
  }
  hits.push(now);
  feedbackHits.set(ip, hits);
  if (feedbackHits.size > 500) feedbackHits.clear();
  return true;
}

async function handleFeedback(request, env, corsHeaders) {
  const json = function (obj, status) {
    return new Response(JSON.stringify(obj),
      { status: status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  };
  if (!env.GEMINI_API_KEY) {
    return json({ ok: false, error: 'AI feedback is not set up yet. Your writing was still sent to your teacher.' }, 503);
  }
  let data;
  try {
    data = await request.json();
  } catch (e) {
    return json({ ok: false, error: 'Invalid JSON' }, 400);
  }
  const text = String(data.text || '').trim();
  if (text.length < 15) {
    return json({ ok: false, error: 'Write at least one full sentence first, then try again.' }, 400);
  }
  const lesson = String(data.lesson || '').trim();
  const lessonTitle = String(data.lessonTitle || lesson).trim();
  const activityId = String(data.activityId || '').trim();
  const activityTitle = String(data.activityTitle || activityId).trim();
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  if (!feedbackAllowed(ip)) {
    return json({ ok: false, error: 'Too many checks. Wait a few minutes, then try again.' }, 429);
  }
  const rubric = pickFeedbackRubric(lesson, activityId, activityTitle);
  const prompt = buildFeedbackPrompt(rubric, text.slice(0, 2000), activityTitle, lessonTitle);
  // Try models in order so one model's daily limit never blocks learners.
  const models = ['gemini-2.5-flash', 'gemini-3.1-flash-lite', 'gemini-3.5-flash-lite', 'gemma-4-31b-it', 'gemma-4-26b-a4b-it'];
  let lastStatus = 502;
  for (let mi = 0; mi < models.length; mi++) {
    const model = models[mi];
    const genConfig = { temperature: 0.4, maxOutputTokens: 900 };
    if (model === 'gemini-2.5-flash') genConfig.thinkingConfig = { thinkingBudget: 0 };
    let ctrl;
    try {
      ctrl = new AbortController();
      const timer = setTimeout(function () { ctrl.abort(); }, 25000);
      let res;
      try {
        res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/' + model + ':generateContent?key=' + env.GEMINI_API_KEY, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: genConfig
          }),
          signal: ctrl.signal
        });
      } finally {
        clearTimeout(timer);
      }
      if (res.ok) {
        const out = await res.json();
        const parts = (((out.candidates || [])[0] || {}).content || {}).parts || [];
        const feedback = parts.map(function (p) { return p.text || ''; }).join('').trim();
        if (feedback) {
          return json({ ok: true, feedback: feedback.slice(0, 3000) }, 200);
        }
        console.error('Gemini feedback empty', model);
        return json({ ok: false, error: 'The AI checker gave no answer. Try again in a minute.' }, 502);
      }
      lastStatus = res.status;
      let detail = '';
      try { detail = await res.text(); } catch (e) { detail = ''; }
      console.error('Gemini feedback HTTP', model, res.status, detail.slice(0, 200));
      if (!isQuotaError(res.status, detail) || mi === models.length - 1) {
        return json({ ok: false, error: 'The AI checker is busy. Try again in a minute. Your writing was still sent to your teacher.' }, 502);
      }
      // Otherwise fall through to the next model.
    } catch (e) {
      console.error('Gemini feedback error', model, e && e.message ? e.message : e);
      if (mi === models.length - 1) {
        return json({ ok: false, error: 'The AI checker is busy. Try again in a minute. Your writing was still sent to your teacher.' }, 504);
      }
      // Network/abort errors also fall through to the next model.
    }
  }
  console.error('Gemini feedback all models exhausted, last status', lastStatus);
  return json({ ok: false, error: 'The AI checker is busy. Try again in a minute. Your writing was still sent to your teacher.' }, 502);
}

function isQuotaError(status, detail) {
  if (status === 429) return true;
  if (status === 403 || status === 400 || status === 503) {
    return /quota|rate.?limit|exceed|exhaust|resource.?exhausted|daily/i.test(String(detail || ''));
  }
  return false;
}

async function handleReview(request, env, corsHeaders) {
  let data;
  try {
    data = await request.json();
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: 'Invalid JSON' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  const rating = parseInt(data.rating, 10);
  const text = String(data.text || '').trim();
  const name = String(data.name || '').trim();
  const email = String(data.email || '').trim();
  const anonymous = !!data.anonymous;
  const emailOk = !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!(rating >= 1 && rating <= 5) || !text || !emailOk) {
    return new Response(JSON.stringify({ ok: false, error: 'Missing or invalid fields' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
  const who = anonymous ? 'Anonymous' : (name || 'A guest');

  const body = 'New review\n\n'
    + 'Rating: ' + rating + '/5 ' + stars + '\n'
    + (anonymous ? '(Submitted anonymously)\n' : '')
    + 'Name: ' + who + (email ? '\nEmail: ' + email : '') + '\n\n'
    + 'Review:\n' + text;

  const html = '<h2>New review</h2>'
    + '<p><strong>Rating:</strong> ' + rating + '/5 ' + stars + '</p>'
    + (anonymous ? '<p><em>Submitted anonymously</em></p>' : '')
    + '<p><strong>Name:</strong> ' + escapeHtml(who)
    + (email ? '<br><strong>Email:</strong> ' + escapeHtml(email) : '') + '</p>'
    + '<p>' + escapeHtml(text) + '</p>';

  try {
    const res = await sendBrevo(env, {
      sender: { name: 'Site Review', email: 'punit@punitganjara.com' },
      to: [{ email: 'punit@punitganjara.com' }],
      replyTo: email ? { email: email, name: name || 'Reviewer' } : { email: 'punit@punitganjara.com' },
      subject: 'New ' + rating + '-star review from ' + who,
      textContent: body,
      htmlContent: html
    });
    if (!res.ok) {
      const detail = await res.text();
      return new Response(JSON.stringify({ ok: false, error: 'Email send failed', detail }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: 'Email send error' }),
      { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  return new Response(JSON.stringify({ ok: true }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
}

function sendBrevo(env, payload) {
  return fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': env.BREVO_API_KEY,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(payload)
  });
}

function pad(n) { return String(n).padStart(2, '0'); }

function formatICSDate(d) {
  return d.getUTCFullYear() + pad(d.getUTCMonth() + 1) + pad(d.getUTCDate())
    + 'T' + pad(d.getUTCHours()) + pad(d.getUTCMinutes()) + pad(d.getUTCSeconds()) + 'Z';
}

function escapeICS(s) {
  return String(s)
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

function toBase64(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

function buildICS({ name, email, date, time }) {
  // date: YYYY-MM-DD, time: HH:MM entered as HCMC local (UTC+7, no DST)
  const local = new Date(date + 'T' + time + ':00+07:00');
  const end = new Date(local.getTime() + 40 * 60000);
  const uid = crypto.randomUUID() + '@punitganjara.com';
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//punitganjara.com//Trial Lesson//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    'UID:' + uid,
    'DTSTAMP:' + formatICSDate(new Date()),
    'DTSTART:' + formatICSDate(local),
    'DTEND:' + formatICSDate(end),
    'SUMMARY:Trial lesson with Punit Ganjara',
    'DESCRIPTION:A 40-minute trial English lesson. Looking forward to meeting you!',
    'STATUS:CONFIRMED',
    'TRANSP:OPAQUE',
    'ORGANIZER;CN=Punit Ganjara:mailto:punit@punitganjara.com',
    'ATTENDEE;CN=' + escapeICS(name) + ';RSVP=TRUE:mailto:' + email,
    'END:VEVENT',
    'END:VCALENDAR'
  ];
  return lines.join('\r\n');
}
