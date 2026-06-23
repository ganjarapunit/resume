const LRS_CONFIG = {
  endpoint: 'https://portfolio-testing.lrs.io/xapi/',
  username: 'e6437770-3130-4514-8b43-522464737f29',
  password: '4abefa78-163e-4b76-b767-c4adaaaa883f'
};

class XapiTracker {
  constructor() {
    this.queue = [];
    this.flushing = false;
    this.activityId = 'https://ganjarapunit.github.io/resume/branching-scenario';
    this.activityName = 'Error Correction Dilemmas';
    this.activityDesc = 'A branching scenario for new EFL teachers — 27 authentic teaching moments exploring error correction strategies.';
    this.sentStatements = 0;
    this.totalStatements = 0;
  }

  statement(verb, object, opts = {}) {
    const stmt = {
      actor: {
        objectType: 'Agent',
        name: state.learnerName || 'Anonymous Teacher',
        mbox: 'mailto:' + (state.learnerName ? state.learnerName.toLowerCase().replace(/\s+/g, '.') : 'anonymous') + '@example.com'
      },
      verb: verb,
      object: object,
      context: {
        platform: 'Teacher Trainer Branching Scenario',
        language: 'en',
        extensions: {
          'https://ganjarapunit.github.io/resume/extensions/course-version': '1.0'
        }
      },
      timestamp: new Date().toISOString()
    };

    if (opts.result) stmt.result = opts.result;
    if (opts.contextExtensions) stmt.context.extensions = { ...stmt.context.extensions, ...opts.contextExtensions };

    this.totalStatements++;
    console.log('[xAPI] Statement #' + this.totalStatements + ':', JSON.stringify(stmt, null, 2));

    this.queue.push(stmt);
    this.flush();
    return stmt;
  }

  async flush() {
    if (this.flushing) return;
    this.flushing = true;
    while (this.queue.length) {
      const batch = this.queue.splice(0, 5);
      try {
        const res = await fetch(LRS_CONFIG.endpoint + '/statements', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa(LRS_CONFIG.username + ':' + LRS_CONFIG.password),
            'X-Experience-API-Version': '1.0.3'
          },
          body: JSON.stringify(batch.length === 1 ? batch[0] : batch)
        });
        if (res.ok) {
          this.sentStatements += batch.length;
          console.log('[xAPI] Batch of ' + batch.length + ' statement(s) sent to LRS ✅');
        } else {
          console.warn('[xAPI] LRS returned ' + res.status + ': ' + res.statusText);
          this.queue.unshift(...batch);
          break;
        }
      } catch (e) {
        console.warn('[xAPI] Failed to send to LRS:', e.message);
        this.queue.unshift(...batch);
        break;
      }
    }
    this.flushing = false;
  }
}

const xapi = new XapiTracker();

const state = {
  currentNode: 'intro',
  scores: { accuracy: 0, affect: 0, technique: 0 },
  choices: [],
  nodeIndex: {},
  path: [],
  introShown: true,
  learnerName: ''
};

SCENARIOS.forEach((s, i) => { state.nodeIndex[s.id] = i; });

function announce(msg) {
  const el = document.getElementById('announcements');
  if (!el) return;
  el.textContent = '';
  requestAnimationFrame(() => { el.textContent = msg; });
}

function focusMain() {
  const main = document.getElementById('main-content');
  if (main) main.focus({ preventScroll: true });
}

function render(nodeId) {
  const main = document.getElementById('main-content');
  const scenario = nodeId === 'end-profile' ? END_PROFILE : SCENARIOS.find(s => s.id === nodeId);
  if (!scenario) return;

  state.path.push(nodeId);

  if (nodeId === 'end-profile') {
    renderEndProfile(main);
    updateProgress(SCENARIOS.length, SCENARIOS.length);
    document.getElementById('score-display').style.display = 'none';
    announce('You have completed the scenarios. Viewing your teaching profile.');
    xapi.statement(
      { id: 'http://adlnet.gov/expapi/verbs/completed', display: { 'en-US': 'completed' } },
      { id: xapi.activityId + '/course', definition: { name: { 'en-US': xapi.activityName }, description: { 'en-US': xapi.activityDesc }, type: 'http://adlnet.gov/expapi/activities/course' } },
      { result: { score: { raw: state.scores.accuracy + state.scores.affect + state.scores.technique, max: 36, min: 0 }, extensions: { 'https://ganjarapunit.github.io/resume/extensions/total-choices': state.choices.length, 'https://ganjarapunit.github.io/resume/extensions/path': state.path.join(',') } } }
    );
    xapi.statement(
      { id: 'http://adlnet.gov/expapi/verbs/experienced', display: { 'en-US': 'experienced' } },
      { id: xapi.activityId + '/profile', definition: { name: { 'en-US': 'Teaching Profile' }, description: { 'en-US': 'End-of-training teaching identity profile with scores, traits, and recommendations.' }, type: 'http://adlnet.gov/expapi/activities/assessment' } },
      { result: { score: { raw: state.scores.accuracy + state.scores.affect + state.scores.technique, max: 36, min: 0 }, extensions: { 'https://ganjarapunit.github.io/resume/extensions/accuracy': state.scores.accuracy, 'https://ganjarapunit.github.io/resume/extensions/affect': state.scores.affect, 'https://ganjarapunit.github.io/resume/extensions/technique': state.scores.technique } } }
    );
    focusMain();
    return;
  }

  if (nodeId === 'intro') {
    renderIntro(main);
    document.getElementById('score-display').style.display = 'none';
    document.getElementById('progress-fill').style.width = '0%';
    updateProgressAria(0);
    announce('Welcome. Review the learning objectives and click the button to begin.');
    focusMain();
    return;
  }

  document.getElementById('score-display').style.display = 'flex';

  const idx = SCENARIOS.findIndex(s => s.id === nodeId);
  const total = SCENARIOS.length;

  let choicesHtml = '';
  if (scenario.choices && scenario.choices.length) {
    choicesHtml = '<div class="choices-grid" role="group" aria-label="Choose your response">' +
      scenario.choices.map((c, i) =>
        `<button class="choice-btn" data-target="${c.target}" data-idx="${i}" type="button">
          <span class="choice-label">${String.fromCharCode(65 + i)}. ${c.label}</span>
          <span class="choice-desc">${c.desc}</span>
        </button>`
      ).join('') + '</div>';
  }

  main.innerHTML = `
    <div class="scenario-card">
      <div class="scenario-body">
        <div class="scenario-meta">
          <span class="scenario-number" aria-hidden="true">${idx + 1}</span>
          <span class="scenario-character">${scenario.character || ''}</span>
        </div>
        <h2 class="scenario-title">${scenario.title}</h2>
        <div class="scenario-context">${scenario.context || ''}</div>
        <div class="scenario-description">${scenario.description || ''}</div>
        ${choicesHtml}
      </div>
    </div>
  `;

  updateProgress(idx + 1, total);
  announce(`Scenario ${idx + 1} of ${total}: ${scenario.title}. ${scenario.choices ? scenario.choices.length + ' choices available.' : ''}`);
  focusMain();

  xapi.statement(
    { id: 'http://adlnet.gov/expapi/verbs/progressed', display: { 'en-US': 'progressed' } },
    { id: xapi.activityId + '/scenarios/' + scenario.id, definition: { name: { 'en-US': scenario.title }, description: { 'en-US': (scenario.context || '') + ' ' + (scenario.description || '').replace(/<[^>]*>/g, '') }, type: 'http://adlnet.gov/expapi/activities/lesson' } },
    { contextExtensions: { 'https://ganjarapunit.github.io/resume/extensions/character': scenario.character || '', 'https://ganjarapunit.github.io/resume/extensions/scenario-index': idx, 'https://ganjarapunit.github.io/resume/extensions/total-scenarios': total } }
  );

  main.querySelectorAll('.choice-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.target;
      const idx = parseInt(btn.dataset.idx);
      const choice = scenario.choices[idx];
      makeChoice(choice, target, scenario);
    });
  });
}

function renderIntro(main) {
  const s = SCENARIOS[0];
  main.innerHTML = `
    <div class="scenario-card intro-screen">
      <div class="scenario-body">
        <h1>${s.title}</h1>
        <p>${s.description}</p>
        <h2 class="sr-only">Learning objectives</h2>
        <div class="intro-objectives">
          ${s.objectives.map(o => `<span>${o}</span>`).join('')}
        </div>
        <button class="start-btn" id="start-btn" type="button">Begin Your Teaching Journey</button>
      </div>
    </div>
  `;
  document.getElementById('start-btn').addEventListener('click', () => {
    state.currentNode = 'start-scene';
    render('start-scene');
  });
}

function makeChoice(choice, target, scenario) {
  state.scores.accuracy += choice.scores.accuracy;
  state.scores.affect += choice.scores.affect;
  state.scores.technique += choice.scores.technique;
  updateScoreDisplay();

  state.choices.push({
    node: state.currentNode,
    choice: choice.label,
    scores: { ...choice.scores }
  });

  xapi.statement(
    { id: 'http://adlnet.gov/expapi/verbs/interacted', display: { 'en-US': 'interacted' } },
    { id: xapi.activityId + '/scenarios/' + scenario.id + '/choices/' + choice.label.toLowerCase().replace(/\s+/g, '-'), definition: { name: { 'en-US': choice.label }, description: { 'en-US': choice.desc }, type: 'http://adlnet.gov/expapi/activities/interaction' } },
    { result: { score: { raw: choice.scores.accuracy + choice.scores.affect + choice.scores.technique, max: 15, min: 3 }, extensions: { 'https://ganjarapunit.github.io/resume/extensions/accuracy': choice.scores.accuracy, 'https://ganjarapunit.github.io/resume/extensions/affect': choice.scores.affect, 'https://ganjarapunit.github.io/resume/extensions/technique': choice.scores.technique, 'https://ganjarapunit.github.io/resume/extensions/target': target } } }
  );

  showFeedback(choice.feedback, target);
}

function showFeedback(msg, target) {
  const toast = document.getElementById('feedback-toast');
  toast.className = '';
  toast.textContent = msg;
  announce('Feedback: ' + msg);

  clearTimeout(toast._hide);
  clearTimeout(toast._navigate);

  toast._navigate = setTimeout(() => {
    state.currentNode = target;
    render(target);
  }, 1800);

  toast._hide = setTimeout(() => {
    toast.className = 'hidden';
  }, 3500);
}

const SCORE_DESCRIPTIONS = {
  accuracy: {
    label: 'Accuracy Focus',
    text: 'Your attention to linguistic form and error correction. High scorers prioritize grammatical precision and structured feedback. Low scorers tend to let errors pass unchallenged, which may lead to fossilization over time.'
  },
  affect: {
    label: 'Affect Awareness',
    text: 'Your sensitivity to learner confidence and emotional safety. High scorers build classrooms where students feel comfortable taking risks. Low scorers may inadvertently increase learner anxiety or reduce willingness to communicate.'
  },
  technique: {
    label: 'Technique Range',
    text: 'Your versatility with correction strategies. High scorers draw from a wide toolkit — recasts, elicitation, metalinguistic cues, and delayed correction. Low scorers may rely on a single method, missing opportunities for differentiated feedback.'
  }
};

function renderEndProfile(main) {
  const { accuracy, affect, technique } = state.scores;

  const traits = computeTraits(accuracy, affect, technique);
  const recs = computeRecommendations(accuracy, affect, technique);

  main.innerHTML = `
    <div class="scenario-card end-profile">
      <div class="scenario-body">
        <div class="scenario-meta" style="justify-content:center">
          <span class="scenario-character">Your Teaching Identity</span>
        </div>
        <h2 class="scenario-title">${END_PROFILE.title}</h2>
        <p style="color:var(--text-secondary);line-height:1.6">${END_PROFILE.description}</p>

        <h3 class="sr-only">Your scores</h3>
        <div class="profile-score-grid">
          <div class="profile-score-card">
            <div class="big-number" aria-hidden="true">${accuracy}</div>
            <span class="big-label">Accuracy Focus</span>
            <span class="sr-only">${accuracy} out of 12</span>
          </div>
          <div class="profile-score-card">
            <div class="big-number" aria-hidden="true">${affect}</div>
            <span class="big-label">Affect Awareness</span>
            <span class="sr-only">${affect} out of 12</span>
          </div>
          <div class="profile-score-card">
            <div class="big-number" aria-hidden="true">${technique}</div>
            <span class="big-label">Technique Range</span>
            <span class="sr-only">${technique} out of 12</span>
          </div>
        </div>

        <div class="score-descriptions">
          <div class="score-desc-item">
            <span class="desc-label">${SCORE_DESCRIPTIONS.accuracy.label}</span>
            <span class="desc-text">${SCORE_DESCRIPTIONS.accuracy.text}</span>
          </div>
          <div class="score-desc-item">
            <span class="desc-label">${SCORE_DESCRIPTIONS.affect.label}</span>
            <span class="desc-text">${SCORE_DESCRIPTIONS.affect.text}</span>
          </div>
          <div class="score-desc-item">
            <span class="desc-label">${SCORE_DESCRIPTIONS.technique.label}</span>
            <span class="desc-text">${SCORE_DESCRIPTIONS.technique.text}</span>
          </div>
        </div>

        <h3 class="sr-only">Your teaching traits</h3>
        <ul class="profile-traits">
          ${traits.map(t => `<li class="trait-badge">${t}</li>`).join('')}
        </ul>

        <div class="profile-recs">
          <h3>Recommendations for Your Growth</h3>
          <ul>${recs.map(r => `<li>${r}</li>`).join('')}</ul>
        </div>

        <button class="restart-btn" type="button">Restart the training</button>
      </div>
    </div>
  `;

  const restartBtn = main.querySelector('.restart-btn');
  restartBtn.addEventListener('click', restart);

  announce('Training complete. Your scores: Accuracy ' + accuracy + ', Affect ' + affect + ', Technique ' + technique + ' out of 12 each.');
}

function computeTraits(accuracy, affect, technique) {
  const t = [];
  if (accuracy >= affect && accuracy >= technique) t.push('Accuracy-Driven');
  if (affect >= accuracy && affect >= technique) t.push('Affect-First');
  if (technique >= accuracy && technique >= affect) t.push('Technique-Minded');
  if (accuracy >= 10 && affect >= 10) t.push('Balanced Practitioner');
  if (affect >= 12) t.push('Culturally Responsive');
  if (technique >= 12) t.push('Differentiated Coach');
  if (accuracy >= 12) t.push('Form-Focused Corrector');
  if (accuracy >= 8 && affect >= 8 && technique >= 8) t.push('Reflective Professional');
  if (t.length === 0) t.push('Emerging Teacher');
  return t.slice(0, 4);
}

function computeRecommendations(accuracy, affect, technique) {
  const r = [];
  if (accuracy < 8) r.push('Strengthen your accuracy focus by learning more about form-focused instruction and structured practice activities.');
  if (affect < 8) r.push('Develop your affective awareness by exploring how different correction styles impact learner confidence and willingness to communicate.');
  if (technique < 8) r.push('Expand your technique repertoire by researching elicitation, recasts, metalinguistic feedback, and self-monitoring strategies.');
  if (accuracy >= 10 && affect >= 10) r.push('You show strong balance between accuracy and affect. Focus on refining your diagnosis of when each approach is most effective.');
  if (affect > accuracy * 1.5) r.push('You lean heavily toward affective support. Consider whether some students need more corrective feedback to progress.');
  if (accuracy > affect * 1.5) r.push('You lean heavily toward accuracy. Research shows learner confidence is a prerequisite for risk-taking and language acquisition.');
  if (technique > accuracy && technique > affect) r.push('You have strong technique knowledge. Now work on timing, as knowing when to apply each technique is as important as knowing how.');
  if (r.length < 2) r.push('Continue building reflective practice through teaching journals, peer observation, and student feedback surveys.');
  if (r.length < 2) r.push('Read "Scaffolding Language, Scaffolding Learning" by Pauline Gibbons for practical correction strategies.');
  return r.slice(0, 4);
}

function updateProgress(current, total) {
  const pct = Math.min(100, Math.round((current / total) * 100));
  document.getElementById('progress-fill').style.width = pct + '%';
  updateProgressAria(pct);
}

function updateProgressAria(pct) {
  const bar = document.getElementById('progress-bar');
  if (bar) bar.setAttribute('aria-valuenow', pct);
}

function updateScoreDisplay() {
  const a = document.getElementById('score-accuracy');
  const af = document.getElementById('score-affect');
  const t = document.getElementById('score-technique');
  const prevA = parseInt(a.textContent) || 0;
  const prevAf = parseInt(af.textContent) || 0;
  const prevT = parseInt(t.textContent) || 0;
  a.textContent = state.scores.accuracy;
  af.textContent = state.scores.affect;
  t.textContent = state.scores.technique;
  announce(`Scores updated: Accuracy ${prevA} to ${state.scores.accuracy}, Affect ${prevAf} to ${state.scores.affect}, Technique ${prevT} to ${state.scores.technique}`);
}

function restart() {
  state.currentNode = 'intro';
  state.scores = { accuracy: 0, affect: 0, technique: 0 };
  state.choices = [];
  state.path = [];
  document.getElementById('score-display').style.display = 'none';
  document.getElementById('progress-fill').style.width = '0%';
  updateProgressAria(0);
  const toast = document.getElementById('feedback-toast');
  toast.className = 'hidden';
  clearTimeout(toast._hide);
  clearTimeout(toast._navigate);
  render('intro');
}

function initTheme() {
  const saved = localStorage.getItem('branching-scenario-theme') || 'auto';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcons(saved);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('branching-scenario-theme', next);
  updateThemeIcons(next);
  announce(`Theme switched to ${next} mode`);
}

function updateThemeIcons(theme) {
  const sun = document.querySelector('.icon-sun');
  const moon = document.querySelector('.icon-moon');
  if (!sun || !moon) return;
  if (theme === 'dark') {
    sun.style.display = 'none';
    moon.style.display = '';
  } else {
    sun.style.display = '';
    moon.style.display = 'none';
  }
}

function initNameOverlay() {
  const overlay = document.getElementById('name-overlay');
  const input = document.getElementById('learner-name-input');
  const submitBtn = document.getElementById('name-submit-btn');

  const savedName = localStorage.getItem('branching-scenario-learner');
  if (savedName) {
    state.learnerName = savedName;
    overlay.className = 'name-overlay hidden';
    sendLaunchStatement();
    return;
  }

  overlay.className = 'name-overlay';
  overlay.classList.remove('hidden');
  input.focus();

  function checkInput() {
    submitBtn.disabled = input.value.trim().length < 2;
  }

  input.addEventListener('input', checkInput);

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !submitBtn.disabled) {
      submitName();
    }
  });

  submitBtn.addEventListener('click', submitName);

  function submitName() {
    const name = input.value.trim();
    if (name.length < 2) return;
    state.learnerName = name;
    localStorage.setItem('branching-scenario-learner', name);
    overlay.classList.add('hidden');
    announce('Welcome, ' + name + '. Review the learning objectives to begin.');
    sendLaunchStatement();
    focusMain();
  }
}

function sendLaunchStatement() {
  xapi.statement(
    { id: 'http://adlnet.gov/expapi/verbs/launched', display: { 'en-US': 'launched' } },
    { id: xapi.activityId, definition: { name: { 'en-US': xapi.activityName }, description: { 'en-US': xapi.activityDesc }, type: 'http://adlnet.gov/expapi/activities/course' } }
  );
}



document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNameOverlay();
  const toggle = document.getElementById('theme-toggle');
  if (toggle) toggle.addEventListener('click', toggleTheme);
  render('intro');
});
