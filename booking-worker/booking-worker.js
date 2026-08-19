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
