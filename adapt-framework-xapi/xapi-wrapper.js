(function() {
  'use strict';

  var LRS_ENDPOINT = 'https://portfolio-testing.lrs.io/xapi/';
  var LRS_USERNAME = 'e6437770-3130-4514-8b43-522464737f29';
  var LRS_PASSWORD = '4abefa78-163e-4b76-b767-c4adaaaa883f';
  var BASIC_AUTH = 'Basic ' + btoa(LRS_USERNAME + ':' + LRS_PASSWORD);
  var ACTIVITY_ID = 'https://ganjarapunit.github.io/resume/adapt-course';
  var ACTIVITY_NAME = 'Adapt Framework Mini Course';

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
    var display = key;
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
        id: ACTIVITY_ID,
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

  /* ── Track which questions have been reported (avoid duplicates) ── */
  var _reportedQuestions = {};

  /* ── Track whether completed has been sent ── */
  var _completedSent = false;

  /* ── Track whether page viewed has been sent ── */
  var _pageViewed = false;

  /* ── Question widget selectors for DOM-based tracking ── */
  var QUESTION_SELECTORS = '.mcq__widget.is-complete.is-submitted, ' +
    '.gmcq__widget.is-complete.is-submitted, ' +
    '.slider__widget.is-complete.is-submitted, ' +
    '.matching__widget.is-complete.is-submitted';

  /* ── DOM-based tracking (replaces Adapt event hooks which are inaccessible) ── */
  function setupDOMTracking() {
    /* Initial check for elements already in the DOM */
    _checkPageViewed();
    _checkQuestionSubmissions();
    _checkCourseCompletion();

    /* Set up MutationObserver for ongoing changes */
    var observer = new MutationObserver(function(mutations) {
      var hasClassChanges = false;
      var hasChildChanges = false;

      for (var i = 0; i < mutations.length; i++) {
        var mutation = mutations[i];
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          hasClassChanges = true;
        }
        if (mutation.type === 'childList') {
          hasChildChanges = true;
        }
      }

      if (hasChildChanges) {
        _checkPageViewed();
      }

      if (hasClassChanges || hasChildChanges) {
        _checkQuestionSubmissions();
        _checkCourseCompletion();
      }
    });

    var target = document.getElementById('wrapper') || document.getElementById('app') || document.body;
    observer.observe(target, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class']
    });
  }

  /* ── Check if page content has loaded → send 'viewed' ── */
  function _checkPageViewed() {
    if (_pageViewed) return;
    var pageContent = document.querySelector('.page__inner, .menu__inner');
    if (pageContent) {
      _pageViewed = true;
      xapiTrack('viewed', { completion: true });
      console.log('[xAPI] Page viewed');
    }
  }

  /* ── Check for newly submitted questions → send 'answered' + 'passed'/'failed' ── */
  function _checkQuestionSubmissions() {
    var widgets = document.querySelectorAll(QUESTION_SELECTORS);
    for (var w = 0; w < widgets.length; w++) {
      var widget = widgets[w];
      var compId = _getComponentId(widget);
      if (!compId) continue;
      if (_reportedQuestions[compId]) continue;
      _reportedQuestions[compId] = true;

      var isCorrect = widget.classList.contains('is-correct');

      xapiTrack('answered', {
        response: 'submitted',
        success: !!isCorrect,
        score: {
          scaled: isCorrect ? 1 : 0,
          min: 0,
          max: 1,
          raw: isCorrect ? 1 : 0
        },
        completion: true
      });

      xapiTrack(isCorrect ? 'passed' : 'failed', {
        completion: true,
        success: !!isCorrect
      });

      console.log('[xAPI] Question ' + compId + ' ' + (isCorrect ? '\u2713 passed' : '\u2717 failed'));
    }
  }

  /* ── Check if the course is complete → send 'completed' ── */
  function _checkCourseCompletion() {
    if (_completedSent) return;

    /* Method 1: Assessment results widget is complete */
    var results = document.querySelector('.assessmentResults__widget.is-complete');
    if (results) {
      _reportCompleted();
      return;
    }

    /* Method 2: All question widgets have been submitted */
    var allQs = document.querySelectorAll('.mcq__widget, .gmcq__widget, .slider__widget, .matching__widget');
    if (allQs.length > 0) {
      var allDone = true;
      for (var i = 0; i < allQs.length; i++) {
        if (!allQs[i].classList.contains('is-complete') || !allQs[i].classList.contains('is-submitted')) {
          allDone = false;
          break;
        }
      }
      if (allDone) {
        _reportCompleted();
        return;
      }
    }

    /* Method 3: Notification popup with congratulations/complete text */
    var notifyPopup = document.querySelector('.notify__popup, .notify');
    if (notifyPopup) {
      var text = notifyPopup.textContent || '';
      if (/complete|congratulations|passed|finished|score/i.test(text)) {
        _reportCompleted();
      }
    }
  }

  function _reportCompleted() {
    _completedSent = true;
    xapiTrack('completed', {
      completion: true,
      success: true,
      score: { scaled: 1, min: 0, max: 1, raw: 1 }
    });
    console.log('[xAPI] Course completed');
  }

  /* ── Extract component ID from a widget element ── */
  function _getComponentId(widget) {
    /* Try data-adapt-id on the component container */
    var comp = widget.closest('[data-adapt-id]');
    if (comp) return comp.getAttribute('data-adapt-id');

    /* Try id on the inner container */
    var inner = widget.closest('.component__inner');
    if (inner && inner.id) return inner.id;

    /* Try id on the widget itself */
    if (widget.id) return widget.id;

    /* Fallback: generate a key from the widget's class list */
    var classKey = '';
    var classes = widget.className.split(/\s+/);
    for (var i = 0; i < classes.length; i++) {
      if (classes[i].indexOf('__widget') > -1) {
        classKey = classes[i];
        break;
      }
    }
    return classKey || 'unknown-' + Math.random().toString(36).slice(2, 8);
  }

  onReady(function() {
    /* ── Attempted statement on course load ── */
    xapiTrack('attempted', null, function(err) {
      if (err) console.warn('[xAPI] Failed to send attempted statement:', err);
    });

    /* ── Start DOM-based tracking after Adapt has rendered content ── */
    setTimeout(setupDOMTracking, 1500);

    /* ── Suspended statement on page unload ── */
    window.addEventListener('beforeunload', function() {
      xapiTrack('suspended', null);
    });
  });

})();
