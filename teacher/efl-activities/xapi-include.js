// Shared xAPI include for lesson pages.
// Statements are POSTed to the proxy worker (which adds the LRS secret),
// so no LRS credentials live in this file or the page.
(function () {
  var ENDPOINT = 'https://punitganjara.com/xapi/statements';
  var API_VER = '1.0.3';
  var HOME = 'https://punitganjara.com';

  function actor() {
    try {
      var id = localStorage.getItem('lrs_actor');
      if (!id) { id = 'anon-' + crypto.randomUUID(); localStorage.setItem('lrs_actor', id); }
      return { objectType: 'Agent', account: { homePage: HOME, name: id } };
    } catch (e) {
      return { objectType: 'Agent', account: { homePage: HOME, name: 'anon' } };
    }
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
      statement.context = {
        contextActivities: { category: [{ id: HOME + '/teacher/efl-activities' }] }
      };
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

  function fire() { window.LRS.launched(); window.LRS.experienced(); }
  if (document.readyState === 'complete' || document.readyState === 'interactive') fire();
  else document.addEventListener('DOMContentLoaded', fire);

  // Best-effort: a submitted form means the learner answered and finished.
  document.addEventListener('submit', function () {
    window.LRS.answered();
    window.LRS.completed();
  });

  function terminate() { send({ verb: VERBS.terminated, object: activity() }); }
  window.addEventListener('pagehide', terminate);
  window.addEventListener('beforeunload', terminate);
})();
