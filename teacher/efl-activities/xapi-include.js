// Shared xAPI include for lesson pages.
// - Shows a name/email gate so the teacher knows which learner accessed the lesson.
// - Sends xAPI statements to the proxy worker (which adds the LRS secret server-side),
//   so no LRS credentials live in this file or the page.
(function () {
  var ENDPOINT = 'https://punitganjara.com/xapi/statements';
  var API_VER = '1.0.3';
  var HOME = 'https://punitganjara.com';
  var LS_LEARNER = 'lrs_learner';
  var LS_ANON = 'lrs_actor';

  function learner() {
    try { return JSON.parse(localStorage.getItem(LS_LEARNER) || 'null'); } catch (e) { return null; }
  }
  function anonId() {
    var id = localStorage.getItem(LS_ANON);
    if (!id) { id = 'anon-' + crypto.randomUUID(); localStorage.setItem(LS_ANON, id); }
    return id;
  }
  function actor() {
    var l = learner();
    if (l && l.email) {
      return { objectType: 'Agent', name: l.name || '', mbox: 'mailto:' + l.email };
    }
    return { objectType: 'Agent', name: l ? l.name : 'Guest', account: { homePage: HOME, name: anonId() } };
  }

  function activity() {
    return { objectType: 'Activity', id: location.href.split('#')[0] };
  }
  function verb(uri, display) {
    return { id: uri, display: { 'en-US': display } };
  }
  function send(statement) {
    statement.actor = actor();
    statement.timestamp = new Date().toISOString();
    if (!statement.context) {
      statement.context = { contextActivities: { category: [{ id: HOME + '/teacher/efl-activities' }] } };
    }
    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Experience-API-Version': API_VER },
      body: JSON.stringify([statement])
    }).catch(function () {});
  }

  var VERBS = {
    launched: verb('http://adlnet.gov/expapi/verbs/launched', 'launched'),
    experienced: verb('http://adlnet.gov/expapi/verbs/experienced', 'experienced'),
    answered: verb('http://adlnet.gov/expapi/verbs/answered', 'answered'),
    completed: verb('http://adlnet.gov/expapi/verbs/completed', 'completed'),
    terminated: verb('http://adlnet.gov/expapi/verbs/terminated', 'terminated')
  };

  window.LRS = {
    send: send,
    launched: function () { send({ verb: VERBS.launched, object: activity() }); },
    experienced: function () { send({ verb: VERBS.experienced, object: activity() }); },
    answered: function (extra) { send(Object.assign({ verb: VERBS.answered, object: activity() }, extra || {})); },
    completed: function (extra) { send(Object.assign({ verb: VERBS.completed, object: activity() }, extra || {})); }
  };

  // ---- Name/email gate ----
  function injectStyle() {
    var css = '#lrs-gate{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;' +
      'background:rgba(5,12,24,.82);padding:20px;font-family:system-ui,"Segoe UI",Arial,sans-serif}' +
      '#lrs-gate .card{max-width:380px;width:100%;background:#fff;color:#07142b;border-radius:14px;padding:24px;' +
      'box-shadow:0 10px 40px rgba(0,0,0,.35)}' +
      '#lrs-gate h2{margin:0 0 6px;font-size:1.2rem}' +
      '#lrs-gate p.sub{margin:0 0 14px;font-size:.92rem;color:#3a4a63;line-height:1.45}' +
      '#lrs-gate label{display:block;font-weight:600;font-size:.85rem;margin:12px 0 4px}' +
      '#lrs-gate .opt{font-weight:400;color:#3a4a63}' +
      '#lrs-gate input{width:100%;padding:10px 12px;border:2px solid #c3d0e3;border-radius:8px;font-size:1rem;box-sizing:border-box}' +
      '#lrs-gate input:focus-visible{outline:3px solid #0b3d91;outline-offset:1px;border-color:#0b3d91}' +
      '#lrs-gate button{margin-top:18px;width:100%;padding:11px 14px;border:0;border-radius:8px;background:#0b3d91;' +
      'color:#fff;font-weight:700;font-size:1rem;cursor:pointer}' +
      '#lrs-gate button:hover{background:#072c69}' +
      '#lrs-gate .err{color:#b00020;font-size:.85rem;margin:8px 0 0;font-weight:600}';
    var s = document.createElement('style');
    s.textContent = css;
    document.head.appendChild(s);
  }

  function showGate(onDone) {
    injectStyle();
    var gate = document.createElement('div');
    gate.id = 'lrs-gate';
    gate.setAttribute('role', 'dialog');
    gate.setAttribute('aria-modal', 'true');
    gate.setAttribute('aria-labelledby', 'lrs-gate-h');
    gate.innerHTML =
      '<div class="card">' +
        '<h2 id="lrs-gate-h">Before you start</h2>' +
        '<p class="sub">Enter your name so your teacher knows who accessed this lesson. Email is optional.</p>' +
        '<form id="lrs-gate-form" novalidate>' +
          '<label for="lrs-name">Your name <span aria-hidden="true">*</span></label>' +
          '<input id="lrs-name" name="name" autocomplete="name" required>' +
          '<label for="lrs-email">Your email <span class="opt">(optional)</span></label>' +
          '<input id="lrs-email" name="email" type="email" autocomplete="email">' +
          '<button type="submit">Start lesson</button>' +
          '<p class="err" id="lrs-gate-err" hidden>Please enter your name.</p>' +
        '</form>' +
      '</div>';
    document.body.appendChild(gate);
    document.body.style.overflow = 'hidden';
    var form = gate.querySelector('#lrs-gate-form');
    var nameEl = gate.querySelector('#lrs-name');
    var emailEl = gate.querySelector('#lrs-email');
    var errEl = gate.querySelector('#lrs-gate-err');
    nameEl.focus();
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = nameEl.value.trim();
      var email = emailEl.value.trim();
      if (!name) { errEl.hidden = false; nameEl.focus(); return; }
      try { localStorage.setItem(LS_LEARNER, JSON.stringify({ name: name, email: email })); } catch (e) {}
      gate.parentNode.removeChild(gate);
      document.body.style.overflow = '';
      onDone();
    });
  }

  function startTracking() {
    window.LRS.launched();
    window.LRS.experienced();
    document.addEventListener('submit', function () { window.LRS.answered(); window.LRS.completed(); });
    var terminate = function () { send({ verb: VERBS.terminated, object: activity() }); };
    window.addEventListener('pagehide', terminate);
    window.addEventListener('beforeunload', terminate);
  }

  function init() {
    var l = learner();
    if (l && l.name) { startTracking(); }
    else { showGate(startTracking); }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
