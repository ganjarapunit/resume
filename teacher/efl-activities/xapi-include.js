// Shared xAPI include for lesson pages.
// - Neutralises the built-in EF Teach name overlay (we use our own gate instead).
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

  function verb(uri, display) {
    return { id: uri, display: { 'en-US': display } };
  }
  var VERBS = {
    launched: verb('http://adlnet.gov/expapi/verbs/launched', 'launched'),
    experienced: verb('http://adlnet.gov/expapi/verbs/experienced', 'experienced'),
    answered: verb('http://adlnet.gov/expapi/verbs/answered', 'answered'),
    completed: verb('http://adlnet.gov/expapi/verbs/completed', 'completed'),
    terminated: verb('http://adlnet.gov/expapi/verbs/terminated', 'terminated'),
    accessed: verb(HOME + '/expapi/verbs/accessed', 'accessed'),
    listened: verb(HOME + '/expapi/verbs/listened', 'listened to'),
    reviewed: verb(HOME + '/expapi/verbs/reviewed', 'reviewed'),
    practised: verb(HOME + '/expapi/verbs/practised', 'practised'),
    matched: verb(HOME + '/expapi/verbs/matched', 'matched'),
    predicted: verb(HOME + '/expapi/verbs/predicted', 'predicted'),
    reflected: verb(HOME + '/expapi/verbs/reflected', 'reflected'),
    viewed: verb('http://id.tincanapi.com/verb/viewed', 'viewed'),
    wrote: verb(HOME + '/expapi/verbs/wrote', 'wrote'),
    checked: verb(HOME + '/expapi/verbs/checked', 'checked'),
    recorded: verb(HOME + '/expapi/verbs/recorded', 'recorded'),
    read: verb(HOME + '/expapi/verbs/read', 'read')
  };

  function lessonActivityId() { return HOME + location.pathname.split('#')[0]; }

  function lessonInfo() {
    var parts = location.pathname.split('/').filter(Boolean);
    var i = parts.indexOf('efl-activities');
    var level = (parts[i + 1] || '').toUpperCase();
    var category = parts[i + 2] || '';
    var moduleId = (parts[i + 1] || '') + '-' + category.replace(/-english$/, '');
    var catLabel = category.endsWith('-english')
      ? category.slice(0, -8).replace(/^\w/, function (c) { return c.toUpperCase(); }) + ' English'
      : category;
    var moduleName = level + ' ' + catLabel;
    var isIndex = location.pathname.endsWith('/efl-activities/') || location.pathname.endsWith('/efl-activities/index.html') || moduleId === '-index.html' || !level;
    return {
      moduleId: moduleId,
      moduleActivity: HOME + '/teacher/efl-activities/#' + moduleId,
      moduleName: moduleName,
      isIndex: isIndex
    };
  }

  function specificVerb() {
    var f = location.pathname.toLowerCase();
    if (/listening/.test(f)) return VERBS.listened;
    if (/tenses|review/.test(f)) return VERBS.reviewed;
    if (/conditional/.test(f)) return VERBS.practised;
    return VERBS.experienced;
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
  function emit(v, act, extra) {
    const obj = { objectType: 'Activity', id: (act && act.id) || '' };
    if (extra && extra.definition) obj.definition = extra.definition;
    if (extra && extra.name && (!obj.definition || !obj.definition.name)) {
      obj.definition = obj.definition || {};
      obj.definition.name = { 'en-US': extra.name };
    }
    send({ verb: v, object: obj });
  }

  window.LRS = {
    send: send,
    launched: function (extra) { emit(VERBS.launched, { objectType: 'Activity', id: lessonActivityId() }, extra || {}); },
    experienced: function (extra) { emit(VERBS.experienced, { objectType: 'Activity', id: lessonActivityId() }, extra || {}); },
    answered: function (extra) { send(Object.assign({ verb: VERBS.answered, object: { objectType: 'Activity', id: lessonActivityId() } }, extra || {})); },
    completed: function (extra) { send(Object.assign({ verb: VERBS.completed, object: { objectType: 'Activity', id: lessonActivityId() } }, extra || {})); },
    itemAccessed: function (itemName, itemType) {
      // Use a simple, readable id like "act5: B) high stakes" to mirror the successful lesson's LRS display
      // For hierarchical clarity, also include the lesson prefix when on a lesson page
      var isQuestion = itemType === 'question' || itemType === 'vocabulary';
      var id = isQuestion ? itemName : (lessonActivityId() + '#' + (itemName || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').substring(0, 60) || 'item');
      // For questions, use the full stem + choice as both id and name so the LRS Object column is instantly clear
      if (isQuestion) id = itemName;
      emit(VERBS.accessed, { objectType: 'Activity', id: id }, { name: itemName, definition: { type: 'http://adlnet.gov/expapi/activities/' + (itemType || 'item'), description: { 'en-US': itemName } } });
    }
  };

  // ---- Neutralise the built-in EF Teach name overlay (we use our own gate) ----
  function neutralizeBuiltin() {
    var bl = document.getElementById('login');
    if (bl && bl.parentNode) bl.parentNode.removeChild(bl);
    var cn = document.getElementById('learnerName');
    if (cn) {
      try {
        var l = JSON.parse(localStorage.getItem(LS_LEARNER) || 'null');
        if (l && l.name) cn.value = l.name;
      } catch (e) {}
      cn.style.display = 'none';
      var lbl = document.querySelector('label[for="learnerName"]');
      if (lbl) lbl.style.display = 'none';
    }
  }

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
      try { localStorage.setItem(LS_LEARNER, JSON.stringify({ name: name, email: email })); } catch (e2) {}
      gate.parentNode.removeChild(gate);
      document.body.style.overflow = '';
      onDone();
    });
  }

  function startTracking() {
    var info = lessonInfo();
    // On the index page, just track course access, not lesson launch
    if (info.isIndex) {
      emit(VERBS.accessed, { objectType: 'Activity', id: HOME + '/teacher/efl-activities', definition: { name: { 'en-US': 'EFL Activities' }, type: 'http://adlnet.gov/expapi/activities/course' } });
      // Track clicks on any lesson link or module card on the index
      document.querySelectorAll('a.lesson, .card a, .efl-group a').forEach(function(a){
        a.addEventListener('click', function(){
          var name = a.textContent.trim().replace(/\s+/g, ' ').substring(0, 80) || a.getAttribute('href');
          if(window.LRS && window.LRS.itemAccessed) window.LRS.itemAccessed(name, 'lesson-link');
        });
      });
      return;
    }
    var lessonAct = { objectType: 'Activity', id: lessonActivityId(), definition: { name: { 'en-US': document.title }, type: 'http://adlnet.gov/expapi/activities/lesson' } };
    var moduleAct = {
      objectType: 'Activity',
      id: info.moduleActivity,
      definition: { name: { 'en-US': info.moduleName }, type: 'http://adlnet.gov/expapi/activities/module' }
    };
    // Launched + the activity-specific verb for this lesson
    emit(VERBS.launched, lessonAct);
    emit(specificVerb(), lessonAct);
    // Module / course access with strategic assignment by module (so you know which module/course was accessed)
    emit(VERBS.accessed, moduleAct);

    // Variety of verbs specific to the activity for precise tracking
    function sendItem(verb, name, type){
      var slug = (name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').substring(0, 60) || 'item';
      var id = lessonActivityId() + '#' + slug;
      emit(verb, { objectType: 'Activity', id: id }, { name: name, definition: { type: 'http://adlnet.gov/expapi/activities/' + (type || 'item'), description: { 'en-US': name } } });
    }
    // --- Writing submission to Google Sheets/Docs (ganjarapunit@gmail.com) + email ---
    var SUBMISSION_ENDPOINT = HOME + '/api/submission';
    var submittedCache = new Set();
    function submitWriting(activityEl, text, fieldId, fieldType){
      if(!text || text.trim().length < 3) return;
      var key = (activityEl.id || 'unknown') + '|' + (fieldId || 'field') + '|' + text.trim().substring(0,40);
      if(submittedCache.has(key)) return;
      submittedCache.add(key);
      var l = learner() || {name:'Guest', email:''};
      var payload = {
        name: l.name || 'Guest',
        email: l.email || '',
        lesson: location.pathname,
        lessonTitle: document.title,
        activityId: activityEl.id || 'unknown',
        activityTitle: (activityEl.querySelector('h2') ? activityEl.querySelector('h2').textContent.trim().substring(0,80) : activityEl.id),
        text: text.trim().substring(0, 5000),
        activityType: fieldType || 'writing',
        url: location.href,
        timestamp: new Date().toISOString()
      };
      fetch(SUBMISSION_ENDPOINT, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify(payload)
      }).catch(function(){});
    }
    // Auto-submit all writing in an activity on Check / Mark complete
    function submitActivityWritings(activityEl){
      if(!activityEl) return;
      var fields = activityEl.querySelectorAll('textarea, input.answer');
      fields.forEach(function(f){
        if(!f.value || !f.value.trim()) return;
        // For gap-fills, only submit if meaningful (wide or multi-word)
        if(f.tagName === 'INPUT' && !f.classList.contains('wide') && f.value.trim().split(/\s+/).length < 3){
          var isOpenAct = /act1|act6|act7|act8|act10|act14|act15/.test(activityEl.id);
          if(!isOpenAct) return;
        }
        if(f.value.trim().length < 3) return;
        submitWriting(activityEl, f.value, f.id || f.name || 'field', f.tagName === 'TEXTAREA' ? 'writing' : 'gap-fill');
      });
    }

    // --- Explicit Submit buttons: only for REAL writing tasks (not warm-ups, speak-notes, reflections, goals, single-sentence drills) ---
    // Allowlist by file + activity + field. Multi-part drafts (story chains, 90-sec sets, thesis pairs) share one button per activity.
    var REAL_WRITING = [
      { file: 'annisa-day09', act: 'act3', fields: ['sp3'] },
      { file: 'annisa-day09', act: 'act4', fields: ['sp4'] },
      { file: 'annisa-day09', act: 'act5', fields: ['sp5'] },
      { file: 'annisa-day09', act: 'act6', fields: ['sp6'] },
      { file: 'annisa-day09', act: 'act7', fields: ['spFull'] },
      { file: 'annisa-day09', act: 'act9', fields: ['sp9'] },
      { file: 'annisa-day08', act: 'act1', fields: ['sp1'] },
      { file: 'annisa-day08', act: 'act7', fields: ['sp7'] },
      { file: 'annisa-day08', act: 'act8', fields: ['sp8'] },
      { file: 'annisa-day08', act: 'act9', fields: ['sp9'] },
      { file: 'annisa-day08', act: 'act10', fields: ['sp10'] },
      { file: 'annisa-day07', act: 'act1', fields: ['sp1'] },
      { file: 'annisa-day07', act: 'act7', fields: ['sp7'] },
      { file: 'annisa-day07', act: 'act8', fields: ['sp8'] },
      { file: 'annisa-day07', act: 'act9', fields: ['sp9'] },
      { file: 'annisa-day07', act: 'act10', fields: ['sp10'] },
      { file: 'annisa-day06', act: 'act1', fields: ['sp1'] },
      { file: 'annisa-day06', act: 'act9', fields: ['sp9'] },
      { file: 'annisa-day06', act: 'act10', fields: ['sp10'] },
      { file: 'annisa-day05', act: 'act1', fields: ['sp1'] },
      { file: 'annisa-day05', act: 'act7', fields: ['sp7'] },
      { file: 'annisa-day05', act: 'act8', fields: ['sp8'] },
      { file: 'annisa-day05', act: 'act9', fields: ['sp9a', 'sp9b'] },
      { file: 'annisa-day05', act: 'act10', fields: ['sp10'] },
      { file: 'annisa-day04', act: 'act8', fields: ['sp8'] },
      { file: 'annisa-day04', act: 'act9', fields: ['sp9a', 'sp9b'] },
      { file: 'annisa-day03', act: 'act7', fields: ['sp7'] },
      { file: 'annisa-day03', act: 'act8', fields: ['sp8'] },
      { file: 'annisa-day03', act: 'act9', fields: ['sp9'] },
      { file: 'annisa-day02', act: 'act7', fields: ['sp7'] },
      { file: 'annisa-day02', act: 'act8', fields: ['sp8'] },
      { file: 'annisa-day02', act: 'act9', fields: ['sp9'] },
      { file: 'complex-clauses-b2-part2', act: 'act6', fields: ['t6-1', 't6-2', 't6-3', 't6-4'] },
      { file: 'complex-clauses-b2-part2', act: 'act7', fields: ['t7-1', 't7-2', 't7-3'] },
      { file: 'complex-clauses-b2-part2', act: 'act10', fields: ['a10-1', 'a10-2', 'a10-3', 'a10-4', 'a10-5', 'a10-6'] },
      { file: 'complex-clauses-b2-shirley', act: 'act10', fields: ['a10-1', 'a10-2', 'a10-3', 'a10-4', 'a10-5', 'a10-6'] },
      { file: 'adverbial-wh-clauses', act: 'act14', fields: ['a14-3', 'a14-4', 'a14-5'] },
      { file: 'adverbial-wh-clauses', act: 'act15', fields: ['a15-draft'] },
      { file: 'lesson-17', act: 'act10', fields: ['a10input'], input: true },
      { file: 'lesson-17', act: 'act13', fields: ['a13input'], input: true },
      { file: 'lesson-17', act: 'act15', fields: ['a15q1', 'a15q2'] },
      { file: 'lesson-17', act: 'act17', fields: ['a17input', 'a17q'] },
      { file: 'lesson-17', act: 'act19', fields: ['a19input'], input: true },
      { file: 'conditionals-review', act: 'act9', fields: ['a9a'] },
      { file: 'listening-skills-interview', act: 'act7', fields: ['sp7'] },
      { file: 'listening-skills-interview', act: 'act8', fields: ['sp8'] },
      { file: 'listening-skills-interview', act: 'act9', fields: ['sp9'] },
      { file: 'delta', act: 'a10', fields: ['writeBox'] }
    ];
    function fileTag(){
      var f = location.pathname.toLowerCase();
      if (f.indexOf('lesson-17') > -1) return 'lesson-17';
      if (f.indexOf('delta') > -1) return 'delta';
      if (f.indexOf('complex-clauses-b2-part2') > -1) return 'complex-clauses-b2-part2';
      if (f.indexOf('complex-clauses') > -1) return 'complex-clauses-b2-shirley';
      if (f.indexOf('adverbial-wh-clauses') > -1) return 'adverbial-wh-clauses';
      if (f.indexOf('conditionals-review') > -1) return 'conditionals-review';
      if (f.indexOf('listening-skills-interview') > -1) return 'listening-skills-interview';
      if (f.indexOf('annisa-day09') > -1) return 'annisa-day09';
      if (f.indexOf('annisa-day08') > -1) return 'annisa-day08';
      if (f.indexOf('annisa-day07') > -1) return 'annisa-day07';
      if (f.indexOf('annisa-day06') > -1) return 'annisa-day06';
      if (f.indexOf('annisa-day05') > -1) return 'annisa-day05';
      if (f.indexOf('annisa-day04') > -1) return 'annisa-day04';
      if (f.indexOf('annisa-day03') > -1) return 'annisa-day03';
      if (f.indexOf('annisa-day02') > -1) return 'annisa-day02';
      return '';
    }
    function fieldLabel(container, ta){
      var lab = container.querySelector('label[for="' + ta.id + '"]');
      var t = lab ? lab.textContent.trim().replace(/\s+/g, ' ').substring(0, 60) : '';
      if (!t) t = ta.getAttribute('aria-label') || ta.getAttribute('placeholder') || ta.id;
      return String(t).trim().substring(0, 60);
    }
    function injectSubmitButtons(){
      var tag = fileTag();
      if (!tag) return;
      var seen = {};
      var containers = document.querySelectorAll('.activity, article.card');
      containers.forEach(function(container){
        if (!container.id || seen[container.id]) return;
        seen[container.id] = true;
        var rule = null;
        for (var i = 0; i < REAL_WRITING.length; i++){
          if (REAL_WRITING[i].file === tag && REAL_WRITING[i].act === container.id){ rule = REAL_WRITING[i]; break; }
        }
        if (!rule) return;
        var fields = [];
        rule.fields.forEach(function(fid){
          var ta = document.getElementById(fid);
          if (!ta || !container.contains(ta)) return;
          if (ta.tagName === 'TEXTAREA') fields.push(ta);
          else if (rule.input && ta.tagName === 'INPUT' && (!ta.type || ta.type === 'text' || ta.type === 'search')) fields.push(ta);
        });
        if (!fields.length || container.querySelector('.wsubmit-wrap')) return;
        var anchor = container.querySelector('.exercise') || container.querySelector('.interactive') || container.querySelector('fieldset') || container.querySelector('.activity-body') || container;
        var wrap = document.createElement('div');
        wrap.className = 'wsubmit-wrap';
        wrap.setAttribute('style', 'display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:12px;');
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn wsubmit-btn';
        btn.textContent = fields.length > 1 ? 'Submit writing for feedback (' + fields.length + ' parts)' : 'Submit writing for feedback';
        btn.setAttribute('aria-label', 'Submit your writing in this activity to your teacher for feedback');
        var status = document.createElement('span');
        status.className = 'wsubmit-status';
        status.setAttribute('role', 'status');
        status.setAttribute('aria-live', 'polite');
        status.setAttribute('style', 'font-size:.88rem;font-weight:700;');
        wrap.appendChild(btn);
        wrap.appendChild(status);
        var aibtn = document.createElement('button');
        aibtn.type = 'button';
        aibtn.className = 'btn ghost waifeedback-btn';
        aibtn.textContent = 'Instant AI feedback';
        aibtn.setAttribute('aria-label', 'Get instant AI feedback on your writing in this activity');
        wrap.appendChild(aibtn);
        anchor.appendChild(wrap);
        var aibox = document.createElement('div');
        aibox.className = 'waifeedback-box';
        aibox.setAttribute('role', 'status');
        aibox.setAttribute('aria-live', 'polite');
        aibox.setAttribute('style', 'display:none;margin-top:10px;padding:10px 12px;border:2px solid currentColor;border-radius:10px;font-size:.9rem;line-height:1.55;white-space:pre-wrap;opacity:.95;');
        aibox.hidden = true;
        anchor.appendChild(aibox);
        aibtn.addEventListener('click', function(){
          var parts = [];
          fields.forEach(function(ta){
            var v = (ta.value || '').trim();
            if (v.length >= 3) parts.push('[' + fieldLabel(container, ta) + ']\n' + v.substring(0, 2500));
          });
          var combined = parts.join('\n\n').trim();
          if (!combined || combined.replace(/\[.*?\]/g, '').trim().length < 15){
            aibox.hidden = false;
            aibox.style.display = '';
            aibox.textContent = 'Write at least one full sentence first, then ask for feedback.';
            fields[0].focus();
            return;
          }
          aibtn.disabled = true;
          var aiOrig = aibtn.textContent;
          aibtn.textContent = 'Checking...';
          aibox.hidden = false;
          aibox.style.display = '';
          aibox.textContent = 'Reading your writing...';
          var h = container.querySelector('h2');
          fetch(HOME + '/api/feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              lesson: location.pathname,
              lessonTitle: document.title,
              activityId: container.id,
              activityTitle: (h ? h.textContent.trim().substring(0, 80) : container.id),
              text: combined.substring(0, 2000)
            })
          }).then(function(r){
            return r.json().catch(function(){ return { ok: false }; });
          }).then(function(j){
            if (j && j.ok && j.feedback) {
              aibox.textContent = j.feedback;
            } else {
              aibox.textContent = (j && j.error) ? j.error : 'The AI checker is busy. Try again in a minute. Your teacher will still give feedback after you submit.';
            }
            aibtn.textContent = 'Check again';
            aibtn.disabled = false;
          }).catch(function(){
            aibox.textContent = 'No connection. Check internet and try again. Your teacher will still give feedback after you submit.';
            aibtn.textContent = aiOrig;
            aibtn.disabled = false;
          });
        });
        btn.addEventListener('click', function(){
          var parts = [];
          fields.forEach(function(ta){
            var v = (ta.value || '').trim();
            if (v.length >= 3) parts.push('[' + fieldLabel(container, ta) + ']\n' + v.substring(0, 2500));
          });
          var combined = parts.join('\n\n').trim();
          if (!combined || combined.replace(/\[.*?\]/g, '').trim().length < 15){
            status.textContent = 'Write at least a sentence first, then submit.';
            fields[0].focus();
            return;
          }
          btn.disabled = true;
          var origText = btn.textContent;
          btn.textContent = 'Sending...';
          status.textContent = '';
          var l = learner() || { name: 'Guest', email: '' };
          var h = container.querySelector('h2');
          var payload = {
            name: l.name || 'Guest',
            email: l.email || '',
            lesson: location.pathname,
            lessonTitle: document.title,
            activityId: container.id,
            activityTitle: (h ? h.textContent.trim().substring(0, 80) : container.id),
            text: combined.substring(0, 5000),
            activityType: 'writing-submit',
            url: location.href,
            timestamp: new Date().toISOString()
          };
          fetch(SUBMISSION_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          }).then(function(r){
            if (!r.ok) throw new Error('bad status');
            return r.json().catch(function(){ return {}; });
          }).then(function(){
            try { submittedCache.add(container.id + '|submit|' + combined.substring(0, 40)); } catch (e) {}
            status.textContent = 'Submitted. Punit will give feedback.';
            btn.textContent = 'Submitted. Send again if you edit.';
            btn.disabled = false;
          }).catch(function(){
            status.textContent = 'Could not submit. Check connection and try again.';
            btn.textContent = origText;
            btn.disabled = false;
          });
        });
      });
    }

    // Check answers -> checked, Mark done/complete -> completed, View script/model -> viewed
    document.querySelectorAll('[data-check]').forEach(function(btn){
      btn.addEventListener('click', function(){
        var sec = document.getElementById(btn.dataset.check);
        var heading = sec ? (sec.querySelector('.act-head h2') || sec.querySelector('h2') || sec.querySelector('h3')) : null;
        var itemName = heading ? heading.textContent.trim() : btn.dataset.check;
        sendItem(VERBS.checked, itemName, 'assessment');
        // Submit any writing in this activity to Google Sheets
        setTimeout(function(){ submitActivityWritings(sec); }, 200);
      });
    });
    document.querySelectorAll('[data-complete]').forEach(function(btn){
      btn.addEventListener('click', function(){
        var sec = document.getElementById(btn.dataset.complete);
        if(!sec) return;
        var heading = sec.querySelector('.act-head h2') || sec.querySelector('h2');
        var itemName = heading ? heading.textContent.trim() : btn.dataset.complete;
        sendItem(VERBS.completed, itemName, 'activity');
        setTimeout(function(){ submitActivityWritings(sec); }, 200);
      });
    });
    document.querySelectorAll('[data-reveal]').forEach(function(btn){
      btn.addEventListener('click', function(){
        setTimeout(function(){
          var sec = document.getElementById(btn.dataset.reveal);
          if(sec){
            var heading = sec.querySelector('h3');
            var itemName = heading ? heading.textContent.replace(/Show|Hide|model answer/, '').trim() : btn.dataset.reveal;
            sendItem(VERBS.viewed, 'Model answer: ' + itemName, 'model');
          } else {
            var txt = btn.textContent.trim();
            sendItem(VERBS.viewed, txt, 'script');
          }
        }, 200);
      });
    });
    // Per-question: vocabulary matched, listening/reading answered, with specific verbs
    document.querySelectorAll('.mcq').forEach(function(mcq){
      var stemEl = mcq.querySelector('.stem');
      if(!stemEl) return;
      var qName = stemEl.textContent.trim().replace(/\s+/g, ' ').substring(0, 100);
      var group = mcq.dataset.group || '';
      var act = mcq.closest('.activity');
      var actId = act ? act.id : group;
      mcq.querySelectorAll('input[type=radio]').forEach(function(radio){
        radio.addEventListener('change', function(){
          if(this.checked){
            var label = this.closest('label');
            var choiceText = label ? label.textContent.trim().replace(/\s+/g, ' ').substring(0, 60) : this.value;
            var fullName = actId + ': ' + choiceText + ' (' + qName.substring(0,40) + ')';
            // Use answered for general, matched for vocabulary (act2)
            var v = (actId === 'act2' || actId === 'a2') ? VERBS.matched : VERBS.answered;
            sendItem(v, fullName, 'question');
          }
        });
      });
    });
    // DELTA-style and generic activities: selects = matched, textareas = predicted/reflected/wrote, audio play = listened, record = recorded
    document.querySelectorAll('.activity').forEach(function(act){
      var headingEl = act.querySelector('h2');
      var actName = headingEl ? headingEl.textContent.trim().substring(0, 80) : act.id;
      act.querySelectorAll('button').forEach(function(btn){
        var t = (btn.textContent || '').trim().toLowerCase();
        if(t.includes('mark') || t.includes('done') || t.includes('complete')){
          btn.addEventListener('click', function(){
            setTimeout(function(){ sendItem(VERBS.completed, actName, 'activity'); }, 150);
          });
        } else if(t.includes('check')){
          // already handled by [data-check] above, avoid double
        }
      });
      act.querySelectorAll('select').forEach(function(sel){
        sel.addEventListener('change', function(){
          var label = act.querySelector('label[for="'+sel.id+'"]');
          var itemText = label ? label.textContent.trim().replace(/^\d+\.\s*/, '').substring(0,40) : sel.id;
          var chosen = sel.options[sel.selectedIndex];
          var choiceText = chosen ? chosen.textContent.trim() : sel.value;
          if(choiceText && choiceText !== '— choose —'){
            sendItem(VERBS.matched, act.id + ': ' + itemText + ' -> ' + choiceText, 'vocabulary');
          }
        });
      });
      act.querySelectorAll('textarea').forEach(function(ta){
        var isPredict = /predict/i.test(actName);
        var isReflect = /reflect/i.test(actName);
        var v = isPredict ? VERBS.predicted : (isReflect ? VERBS.reflected : VERBS.wrote);
        var handler = function(){
          if(!ta.value.trim()) return;
          var label = act.querySelector('label[for="'+ta.id+'"]');
          var itemText = label ? label.textContent.trim().substring(0,60) : ta.id;
          sendItem(v, act.id + ': ' + itemText, isPredict ? 'prediction' : (isReflect ? 'reflection' : 'writing'));
          // Also submit to Google Sheets/Docs for teacher feedback
          if(ta.value.trim().length >= 5) submitWriting(act, ta.value, ta.id, isPredict ? 'prediction' : (isReflect ? 'reflection' : 'writing'));
        };
        ta.addEventListener('change', handler);
        ta.addEventListener('blur', handler);
      });
      // Also capture gap-fill writing inputs (input.answer) for feedback tracking
      act.querySelectorAll('input.answer').forEach(function(inp){
        var inpHandler = function(){
          if(!inp.value.trim() || inp.value.trim().length < 2) return;
          // Only submit meaningful writing (not single-word gap fills that are auto-graded)
          // We submit if the input is wide (longer answer) or part of an open writing activity
          var isOpen = /act1|act6|act7|act8|act10|act14|act15/.test(act.id) || inp.classList.contains('wide') || inp.closest('.speak');
          if(!isOpen && inp.value.trim().split(/\s+/).length < 3) return;
          submitWriting(act, inp.value, inp.id || inp.name || 'input', 'gap-fill');
        };
        inp.addEventListener('change', inpHandler);
        inp.addEventListener('blur', inpHandler);
      });
      act.querySelectorAll('audio').forEach(function(aud){
        aud.addEventListener('play', function(){
          sendItem(VERBS.listened, actName + ' - audio', 'audio');
        });
      });
      act.querySelectorAll('[data-record]').forEach(function(btn){
        btn.addEventListener('click', function(){
          sendItem(VERBS.recorded, actName + ' - recording', 'audio');
        });
      });
    });

    injectSubmitButtons();

    document.addEventListener('submit', function () { window.LRS.answered(); window.LRS.completed(); });
    var terminate = function () { send({ verb: VERBS.terminated, object: lessonAct }); };
    window.addEventListener('pagehide', terminate);
    window.addEventListener('beforeunload', terminate);
  }

  function init() {
    neutralizeBuiltin();
    var l = learner();
    if (l && l.name) { startTracking(); }
    else { showGate(startTracking); }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
