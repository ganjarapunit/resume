/**
 * xAPI Wrapper for Adapt Framework LXD Course
 * ---------------------------------------------------------------
 * Sends comprehensive xAPI statements to Veracity LRS.
 * 
 * Actor resolution priority:
 *   1. Learner-entered name from localStorage overlay
 *   2. pipwerks.SCORM wrapper (real LMS connection)
 *   3. SCORM 2004 API (cmi.learner_name)
 *   4. SCORM 1.2 API  (cmi.core.learner_name)
 *   5. Adapt internal data
 *   6. Fallback: generated learner ID
 *
 * IMPORTANT: localStorage check comes BEFORE SCORM API calls because
 * SCORM_API_wrapper.js creates stub API objects even in standalone mode,
 * returning a default "Surname, Sam" name. The overlay-entered name
 * must take priority over these stubs.
 *
 * NOTE: Email field removed from overlay — only name is required.
 * 
 * Statements sent:
 *   - launched    — course started with learner identity
 *   - initialized — Adapt framework + content loaded
 *   - answered    — each branching decision with choice details
 *   - progressed  — through the scenario nodes
 *   - completed   — course finished (all decisions made)
 *   - scored      — final score with min/max/scaled
 *   - passed      — if score >= 60%
 *   - failed      — if score < 60%
 *   - terminated  — on page unload
 */
(function() {
  'use strict';

  /* ── LRS Configuration ── */
  var LRS_ENDPOINT = 'https://portfolio-testing.lrs.io/xapi/';
  var LRS_USERNAME = 'e6437770-3130-4514-8b43-522464737f29';
  var LRS_PASSWORD = '4abefa78-163e-4b76-b767-c4adaaaa883f';
  var BASIC_AUTH   = 'Basic ' + btoa(LRS_USERNAME + ':' + LRS_PASSWORD);
  var ACTIVITY_ID  = 'https://ganjarapunit.github.io/resume/adapt-lxd-frameworks';
  var ACTIVITY_NAME = 'LXD Design Frameworks & Evaluation Standards';
  var ACTIVITY_DESC = 'Interactive branching scenario exploring real-world LXD decisions: project scoping, framework selection, learner analysis, evaluation strategy, and ROI.';

  /* ── Actor Cache (resolved once) ── */
  var _actor = null;

  /**
   * Resolve the xAPI actor from SCORM API or fallback.
   * Tries multiple approaches in priority order.
   */
  function resolveActor() {
    if (_actor) return _actor;

    var name = null;
    var accountName = null;
    var homePage = window.location.origin || 'https://ganjarapunit.github.io';

    // ── Attempt 1: Learner-entered name from localStorage overlay ──
    // MUST come before SCORM API attempts because SCORM_API_wrapper.js
    // creates stub objects with a default "Surname, Sam" name in standalone mode.
    if (!name) {
      try {
        var storedName = localStorage.getItem('xapi_learner_name');
        if (storedName) {
          name = storedName;
          accountName = name.replace(/\s+/g, '.').toLowerCase() + '@learner.local';
          // homePage stays as window.location.origin
        }
      } catch(e) { /* ignore */ }
    }

    // ── Attempt 2: pipwerks SCORM wrapper (real LMS connection) ──
    if (typeof pipwerks !== 'undefined' && pipwerks.SCORM && pipwerks.SCORM.connection && pipwerks.SCORM.connection.isActive) {
      try {
        var scormVer = pipwerks.SCORM.version;
        if (scormVer === '2004') {
          name = pipwerks.SCORM.get('cmi.learner_name');
        } else if (scormVer === '1.2') {
          name = pipwerks.SCORM.get('cmi.core.learner_name');
        }
        if (!name) {
          // Try student_name alternative for SCORM 1.2
          name = pipwerks.SCORM.get('cmi.core.student_name');
        }
        if (name) {
          // Also get learner ID
          try {
            accountName = (scormVer === '2004')
              ? pipwerks.SCORM.get('cmi.learner_id')
              : pipwerks.SCORM.get('cmi.core.student_id');
          } catch(e) { /* ignore */ }
        }
      } catch(e) {
        console.warn('[xAPI] pipwerks SCORM get failed:', e);
      }
    }

    // ── Attempt 2: Direct SCORM API (if pipwerks missed it) ──
    if (!name) {
      try {
        // SCORM 2004
        if (window.API_1484_11) {
          var api2004 = window.API_1484_11;
          name = api2004.GetValue('cmi.learner_name') || null;
          if (!name) accountName = api2004.GetValue('cmi.learner_id') || null;
        }
        // SCORM 1.2
        if (!name && window.API) {
          var api12 = window.API;
          name = api12.LMSGetValue('cmi.core.learner_name') || null;
          if (!name) name = api12.LMSGetValue('cmi.core.student_name') || null;
          accountName = api12.LMSGetValue('cmi.core.student_id') || null;
        }
      } catch(e) {
        console.warn('[xAPI] Direct SCORM API call failed:', e);
      }
    }

    // ── Attempt 3: Check for Adapt's internal SCORM data ──
    if (!name && typeof Adapt !== 'undefined' && Adapt.dataManager) {
      try {
        var learnerData = Adapt.dataManager.get('learner');
        if (learnerData) {
          name = learnerData.name || learnerData.displayName || null;
          accountName = learnerData.id || null;
        }
      } catch(e) { /* ignore */ }
    }

    // ── Fallback: Use generated ID ──
    if (!name) {
      name = 'Learner';
      // Generate or retrieve a persistent learner ID
      try {
        var storedId = localStorage.getItem('xapi_learner_id');
        if (!storedId) {
          storedId = 'learner-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
          localStorage.setItem('xapi_learner_id', storedId);
        }
        accountName = storedId;
      } catch(e) {
        accountName = 'learner-' + Date.now();
      }
    }

    // ── Build actor object ──
    _actor = {
      objectType: 'Agent'
    };

    if (accountName && homePage) {
      // Prefer account (works offline, no email required)
      _actor.account = {
        homePage: homePage,
        name: accountName
      };
      if (name && name !== 'Learner') {
        _actor.name = name;
      }
    } else {
      // Fallback: use mbox
      _actor.mbox = 'mailto:' + (accountName || 'learner') .replace(/[^a-zA-Z0-9]/g, '_') + '@adapt.course';
      if (name) {
        _actor.name = name;
      }
    }

    return _actor;
  }

  /**
   * Send one or more xAPI statements to the LRS.
   * Accepts an array of statement objects or a single statement.
   */
  function sendStatements(statements, callback) {
    var arr = Array.isArray(statements) ? statements : [statements];
    var xhr = new XMLHttpRequest();
    xhr.open('POST', LRS_ENDPOINT + 'statements', true);
    xhr.setRequestHeader('Authorization', BASIC_AUTH);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-Experience-API-Version', '1.0.3');
    xhr.onload = function() {
      if (callback) callback(null, xhr.status);
      if (xhr.status >= 200 && xhr.status < 300) {
        console.log('[xAPI] Statements sent (' + arr.length + '), status:', xhr.status);
      } else {
        console.warn('[xAPI] Statement send failed, status:', xhr.status);
      }
    };
    xhr.onerror = function() {
      console.warn('[xAPI] Network error sending statement');
      if (callback) callback('Network error', null);
    };
    xhr.send(JSON.stringify(arr));
  }

  /**
   * Build a complete xAPI statement with actor, verb, object, optional result + context.
   */
  function buildStatement(verbId, verbDisplay, extensions, result, parentActivity) {
    var actor = resolveActor();
    var statement = {
      actor: actor,
      verb: {
        id: verbId,
        display: { 'en-US': verbDisplay }
      },
      object: {
        objectType: 'Activity',
        id: ACTIVITY_ID + '?ts=' + Date.now(),
        definition: {
          name: { 'en-US': ACTIVITY_NAME },
          description: { 'en-US': ACTIVITY_DESC },
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

    if (extensions) {
      if (!statement.object.definition.extensions) {
        statement.object.definition.extensions = {};
      }
      Object.keys(extensions).forEach(function(k) {
        statement.object.definition.extensions[k] = extensions[k];
      });
    }

    if (result) {
      statement.result = result;
    }

    if (parentActivity) {
      statement.context.contextActivities.parent = [{
        id: parentActivity,
        definition: {
          name: { 'en-US': ACTIVITY_NAME },
          type: 'http://adlnet.gov/expapi/activities/module'
        }
      }];
    }

    return statement;
  }

  /**
   * Build a statement for an interaction (branching decision).
   * Uses the "answered" verb with interaction details in the result.
   */
  function buildInteractionStatement(question, selectedIdx, correctIdx, feedback, isCorrect) {
    var actor = resolveActor();
    return {
      actor: actor,
      verb: {
        id: 'http://adlnet.gov/expapi/verbs/answered',
        display: { 'en-US': 'answered' }
      },
      object: {
        objectType: 'Activity',
        id: ACTIVITY_ID + '/question/' + encodeURIComponent(question.replace(/\s+/g, '-').toLowerCase()),
        definition: {
          name: { 'en-US': question },
          description: { 'en-US': feedback || '' },
          type: 'http://adlnet.gov/expapi/activities/cmi.interaction',
          interactionType: 'choice',
          correctResponsesPattern: ['option_' + correctIdx],
          choices: [
            { id: 'option_0', description: { 'en-US': '' } },
            { id: 'option_1', description: { 'en-US': '' } },
            { id: 'option_2', description: { 'en-US': '' } },
            { id: 'option_3', description: { 'en-US': '' } }
          ]
        }
      },
      result: {
        response: 'option_' + selectedIdx,
        success: isCorrect,
        completion: true,
        extensions: {
          'https://w3id.org/xapi/cmi5/result/extensions/progress': 1
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
  }

  /* ═══════════════════════════════════════════════════
     PUBLIC API — exposed for branching router to call
     ═══════════════════════════════════════════════════ */

  window.XAPI = {
    /**
     * Send a "launched" statement when the page loads.
     */
    sendLaunched: function() {
      sendStatements(buildStatement(
        'http://adlnet.gov/expapi/verbs/launched',
        'launched'
      ));
    },

    /**
     * Send an "initialized" statement when Adapt is ready.
     */
    sendInitialized: function() {
      sendStatements(buildStatement(
        'http://adlnet.gov/expapi/verbs/initialized',
        'initialized',
        { 'https://w3id.org/xapi/cmi5/context/extensions/platform': 'Adapt Framework' }
      ));
    },

    /**
     * Send an "answered" statement for a branching decision.
     */
    sendAnswered: function(question, selectedIdx, correctIdx, feedback, isCorrect) {
      sendStatements(buildInteractionStatement(
        question, selectedIdx, correctIdx, feedback, isCorrect
      ));
    },

    /**
     * Send a "progressed" statement with current progress.
     * progress: number between 0 and 1
     */
    sendProgressed: function(progress, currentNode) {
      sendStatements(buildStatement(
        'http://adlnet.gov/expapi/verbs/progressed',
        'progressed',
        null,
        {
          extensions: {
            'https://w3id.org/xapi/cmi5/result/extensions/progress': Math.round(progress * 100)
          }
        },
        currentNode ? ACTIVITY_ID + '/node/' + currentNode : null
      ));
    },

    /**
     * Send a "scored" statement with the final score.
     */
    sendScored: function(raw, min, max, scaled) {
      sendStatements(buildStatement(
        'http://adlnet.gov/expapi/verbs/scored',
        'scored',
        null,
        {
          score: {
            raw: raw,
            min: min,
            max: max,
            scaled: scaled
          },
          completion: true
        }
      ));
    },

    /**
     * Send "completed" + "passed" or "failed" based on score.
     */
    sendCompleted: function(correct, total) {
      var raw = correct;
      var max = total;
      var scaled = total > 0 ? correct / total : 0;
      var passed = scaled >= 0.6;

      // Send completed
      sendStatements(buildStatement(
        'http://adlnet.gov/expapi/verbs/completed',
        'completed',
        null,
        {
          completion: true,
          success: passed,
          duration: 'PT' + Math.round((Date.now() - window._xapiStartTime) / 1000) + 'S',
          score: {
            raw: raw,
            min: 0,
            max: max,
            scaled: scaled
          }
        }
      ));

      // Send passed or failed
      if (passed) {
        sendStatements(buildStatement(
          'http://adlnet.gov/expapi/verbs/passed',
          'passed',
          null,
          { score: { raw: raw, min: 0, max: max, scaled: scaled }, completion: true, success: true }
        ));
      } else {
        sendStatements(buildStatement(
          'http://adlnet.gov/expapi/verbs/failed',
          'failed',
          null,
          { score: { raw: raw, min: 0, max: max, scaled: scaled }, completion: true, success: false }
        ));
      }
    },

    /**
     * Send a "terminated" statement.
     */
    sendTerminated: function() {
      sendStatements(buildStatement(
        'http://adlnet.gov/expapi/verbs/terminated',
        'terminated'
      ));
    }
  };

  /* ═══════════════════════════════════════════════════
     AUTO-INIT — page load lifecycle
     ═══════════════════════════════════════════════════ */

  // Record start time for duration calculation
  window._xapiStartTime = Date.now();

  function onReady(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  function startXAPISession() {
    // Send launched
    try {
      window.XAPI.sendLaunched();
    } catch(e) {
      console.warn('[xAPI] sendLaunched failed:', e);
    }

    // Send initialized when Adapt framework signals ready
    function waitForAdapt() {
      if (typeof Adapt !== 'undefined' && Adapt.initialized) {
        try {
          window.XAPI.sendInitialized();
        } catch(e) { /* ignore */ }
      } else {
        setTimeout(waitForAdapt, 500);
      }
    }
    setTimeout(waitForAdapt, 1000);

    // Send terminated on page unload
    window.addEventListener('beforeunload', function() {
      try {
        window.XAPI.sendTerminated();
      } catch(e) { /* ignore */ }
    });
  }

  // ── Wait for learner name before starting xAPI session ──
  // In LMS mode, pipwerks SCORM connection provides the name immediately.
  // In standalone mode, the name entry overlay sets xapi_learner_name in localStorage.
  //
  // IMPORTANT: Do NOT check window.API_1484_11 / window.API here —
  // SCORM_API_wrapper.js creates stub objects even without a real LMS,
  // which would cause premature xAPI start with a default "Surname, Sam" name.
  onReady(function() {
    function tryStart() {
      var pipwerksConnected = (
        typeof pipwerks !== 'undefined' && pipwerks.SCORM &&
        pipwerks.SCORM.connection && pipwerks.SCORM.connection.isActive
      );
      var overlayNameSet = !!localStorage.getItem('xapi_learner_name');

      if (pipwerksConnected || overlayNameSet) {
        startXAPISession();
      } else {
        setTimeout(tryStart, 300);
      }
    }
    setTimeout(tryStart, 500);
  });

  console.log('[xAPI] Wrapper loaded. LRS endpoint:', LRS_ENDPOINT);
})();
