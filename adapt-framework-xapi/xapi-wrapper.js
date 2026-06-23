(function() {
  'use strict';

  var LRS_ENDPOINT = 'https://portfolio-testing.lrs.io/xapi/';
  var LRS_USERNAME = 'e6437770-3130-4514-8b43-522464737f29';
  var LRS_PASSWORD = '4abefa78-163e-4b76-b767-c4adaaaa883f';
  var BASIC_AUTH = 'Basic ' + btoa(LRS_USERNAME + ':' + LRS_PASSWORD);
  var ACTIVITY_ID = 'https://ganjarapunit.github.io/resume/adapt-course';
  var ACTIVITY_NAME = 'LXD Design Frameworks & Evaluation Standards';

// Additional xAPI verbs for granular tracking
    var VERBS = {
      attempted:   'http://adlnet.gov/expapi/verbs/attempted',
      initialized: 'http://adlnet.gov/expapi/verbs/initialized',
      initialised: 'http://adlnet.gov/expapi/verbs/initialized',
      launched:    'http://adlnet.gov/expapi/verbs/launched',
      completed:   'http://adlnet.gov/expapi/verbs/completed',
      answered:    'http://adlnet.gov/expapi/verbs/answered',
      interacted:  'http://adlnet.gov/expapi/verbs/interacted',
      progressed:  'http://adlnet.gov/expapi/verbs/progressed',
      terminated:  'http://adlnet.gov/expapi/verbs/terminated',
      passed:      'http://adlnet.gov/expapi/verbs/passed',
      failed:      'http://adlnet.gov/expapi/verbs/failed',
      suspended:   'http://adlnet.gov/expapi/verbs/suspended',
      viewed:      'http://adlnet.gov/expapi/verbs/viewed',
      watched:     'http://adlnet.gov/expapi/verbs/watched',
      experienced: 'http://adlnet.gov/expapi/verbs/experienced',
      skipped:    'http://adlnet.gov/expapi/verbs/skipped',
      unlocked:   'http://adlnet.gov/expapi/verbs/unlocked',
      rated:      'http://adlnet.gov/expapi/verbs/rated',
      shared:     'http://adlnet.gov/expapi/verbs/shared',
      loggedin:    'http://adlnet.gov/expapi/verbs/loggedin',
      loggedout:   'http://adlnet.gov/expapi/verbs/loggedout',
      registered:  'http://adlnet.gov/expapi/verbs/registered',
      joined:      'http://adlnet.gov/expapi/verbs/joined',
      submitted:   'http://adlnet.gov/expapi/verbs/submitted',
      downloaded:  'http://adlnet.gov/expapi/verbs/downloaded',
      uploaded:    'http://adlnet.gov/expapi/verbs/uploaded',
      created:     'http://adlnet.gov/expapi/verbs/created',
      deleted:     'http://adlnet.gov/expapi/verbs/deleted',
      assigned:    'http://adlnet.gov/expapi/verbs/assigned',
      accessed:    'http://adlnet.gov/expapi/verbs/accessed',
      exited:      'http://adlnet.gov/expapi/verbs/exited',
      mastered:    'http://adlnet.gov/expapi/verbs/mastered',
      satisfied:   'http://adlnet.gov/expapi/verbs/satisfied',
      scored:      'http://adlnet.gov/expapi/verbs/scored',
      imported:    'http://adlnet.gov/expapi/verbs/imported',
      preferred:   'http://adlnet.gov/expapi/verbs/preferred'
    };

  // Helper to resolve a verb key to its IRI
  function verbUrl(key) { return VERBS[key] || key; }

  /** Public API – window.xapiTrack('answered', {result:{...}}, callback) */
  function xapiTrack(key, extensions, callback) {
    var url = verbUrl(key);
    var display = key; // simple label; could be localized later
    queueOrSend(url, display, extensions, callback);
  }
  window.xapiTrack = xapiTrack;


  /* ── Learner name management ── */
  function getLearnerName() {
    var name = localStorage.getItem('learnerName');
    return name && name.trim() ? name.trim() : null;
  }

  /* ── Statement queue: defer statements until learner name is provided ── */
  var pendingStatements = [];
  var nameReady = !!getLearnerName();

  function flushPending() {
    while (pendingStatements.length) {
      var item = pendingStatements.shift();
      sendStatement(item.verb, item.verbDisplay, item.extensions, item.callback);
    }
  }

  /* Expose callback so the name overlay can notify us */
  window.onLearnerNameSet = function(name) {
    console.log('[xAPI] Learner identified as: ' + name);
    nameReady = true;
    flushPending();
  };

  function buildActor() {
    var actor = {
      objectType: 'Agent'
    };
    var learnerName = getLearnerName();
    if (learnerName) {
      /* Prefer named identifier when learner name is available */
      actor.account = {
        homePage: window.location.origin,
        name: learnerName
      };
      actor.name = learnerName;
    } else {
      actor.account = {
        homePage: window.location.origin,
        name: LRS_USERNAME
      };
    }
    return actor;
  }

  function sendStatement(verb, verbDisplay, objectExtensions, callback) {
    var statement = {
      actor: buildActor(),
      verb: {
        id: verb,
        display: { 'en-US': verbDisplay }
      },
      object: {
        objectType: 'Activity',
        id: ACTIVITY_ID + '?v=' + Date.now(),
        definition: {
          name: { 'en-US': ACTIVITY_NAME },
          type: 'http://adlnet.gov/expapi/activities/course'
        }
      },
      context: {
        contextActivities: {
          grouping: [{
            id: ACTIVITY_ID,
            definition: {
              name: { 'en-US': ACTIVITY_NAME },
              type: 'http://adlnet.gov/expapi/activities/course'
            }
          }]
        }
      },
      timestamp: new Date().toISOString()
    };

    if (objectExtensions) {
      statement.result = objectExtensions;
    }

    var xhr = new XMLHttpRequest();
    xhr.open('POST', LRS_ENDPOINT + 'statements', true);
    xhr.setRequestHeader('Authorization', BASIC_AUTH);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-Experience-API-Version', '1.0.3');
    xhr.onload = function() {
      if (callback) callback(null, xhr.status);
    };
    xhr.onerror = function() {
      if (callback) callback('Network error', null);
    };
    xhr.send(JSON.stringify([statement]));
  }

  function onReady(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  function queueOrSend(v, vd, ext, cb) {
    if (nameReady) {
      sendStatement(v, vd, ext, cb);
    } else {
      pendingStatements.push({ verb: v, verbDisplay: vd, extensions: ext, callback: cb });
    }
  }

  onReady(function() {
    /* ── Attempted statement on course load ── */
    xapiTrack('attempted', null, function(err) {
      if (err) console.warn('[xAPI] Failed to send attempted statement:', err);
    });

    /* ── Watch for course completion via Adapt notification ── */
    var observer = new MutationObserver(function() {
      var notify = document.querySelector('[data-adapt-notification]');
      if (notify) {
        var text = notify.textContent || '';
        if (text.toLowerCase().indexOf('complete') > -1 || text.toLowerCase().indexOf('congratulations') > -1) {
          xapiTrack('completed', {
            completion: true,
            success: true,
            score: { scaled: 1, min: 0, max: 1, raw: 1 }
          });
          observer.disconnect();
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });

    /* ── Suspended statement on page unload ── */
    window.addEventListener('beforeunload', function() {
      xapiTrack('suspended', null);
    });
  });

})();
