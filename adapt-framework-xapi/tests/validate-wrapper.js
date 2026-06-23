/**
 * xAPI Wrapper — Static Syntax & Structure Validator
 * Run: node tests/validate-wrapper.js
 *
 * Checks:
 *  1. JavaScript syntax (no parse errors)
 *  2. VERBS map completeness
 *  3. All public API functions present
 *  4. Brace/paren matching
 *  5. No duplicate or orphaned code blocks
 */

'use strict';

var fs = require('fs');
var path = require('path');
var vm = require('vm');

var wrapperPath = path.join(__dirname, '..', 'xapi-wrapper.js');
var source = fs.readFileSync(wrapperPath, 'utf8');

var failures = 0;
var passes = 0;

function check(label, condition, detail) {
  if (condition) {
    passes++;
    console.log('  \x1b[32m✓\x1b[0m ' + label);
  } else {
    failures++;
    console.log('  \x1b[31m✗\x1b[0m ' + label + (detail ? ' — ' + detail : ''));
  }
}

function countChar(str, ch) {
  return (str.match(new RegExp('\\' + ch, 'g')) || []).length;
}

console.log('\n\x1b[1mxAPI Wrapper Validator\x1b[0m');
console.log('File: ' + wrapperPath + ' (' + source.length + ' chars, ' + source.split('\n').length + ' lines)\n');

// ── 1. Syntax check ──
console.log('\x1b[1m1. Syntax Validation\x1b[0m');
try {
  // Create a sandbox with browser globals
  var sandbox = {
    window: { location: { origin: 'http://localhost' }, addEventListener: function(){} },
    document: { readyState: 'complete', addEventListener: function(){}, body: {}, querySelector: function(){ return null; } },
    localStorage: { getItem: function(){ return null; }, setItem: function(){}, removeItem: function(){} },
    XMLHttpRequest: function() {
      return {
        open: function(){}, setRequestHeader: function(){}, send: function(){},
        onload: null, onerror: null
      };
    },
    MutationObserver: function() { return { observe: function(){}, disconnect: function(){} }; },
    console: console,
    setTimeout: setTimeout,
    btoa: function(s) { return Buffer.from(s).toString('base64'); }
  };
  var script = new vm.Script(source);
  script.runInNewContext(sandbox);
  check('JavaScript syntax valid', true);
} catch (e) {
  check('JavaScript syntax valid', false, e.message);
}

// ── 2. Brace matching ──
console.log('\n\x1b[1m2. Bracket/Brace Matching\x1b[0m');
var opens = { '(': ')', '{': '}', '[': ']' };
var closes = { ')': '(', '}': '{', ']': '[' };
var stack = [];
var lineNum = 1;
// Track if we're inside a string/regex to skip brackets there
var inString = false, stringChar = '';
for (var i = 0; i < source.length; i++) {
  var ch = source[i];
  if (ch === '\n') lineNum++;
  
  // Skip string/regex content brackets
  if (inString) {
    if (ch === '\\') { i++; continue; } // escape
    if (ch === stringChar) { inString = false; stringChar = ''; }
    continue;
  }
  if (ch === "'" || ch === '"' || ch === '`') { inString = true; stringChar = ch; continue; }
  
  if (opens[ch]) {
    stack.push({ char: ch, line: lineNum });
  } else if (closes[ch]) {
    var expected = closes[ch];
    if (stack.length === 0) {
      check('Brace/paren balanced', false, 'unexpected closing ' + ch + ' at line ' + lineNum + ' (nothing to close)');
    } else if (stack[stack.length-1].char !== expected) {
      check('Brace/paren balanced', false, 'mismatch at line ' + lineNum + ': closing ' + ch + ' but expected closing for ' + stack[stack.length-1].char + ' (opened line ' + stack[stack.length-1].line + ')');
    }
    stack.pop();
  }
}
check('Braces & parens balanced', stack.length === 0, stack.length + ' unclosed: ' + JSON.stringify(stack));

// ── 3. VERBS map ──
console.log('\n\x1b[1m3. VERBS Map\x1b[0m');
var verbsMatch = source.match(/var VERBS\s*=\s*\{([^}]+)\}/);
check('VERBS object present', !!verbsMatch);
if (verbsMatch) {
  var verbsBlock = verbsMatch[1];
  var verbCount = (verbsBlock.match(/:\s*'http/g) || []).length;
  check('VERBS entries', verbCount > 20, verbCount + ' verbs found');

  // Check for duplicate keys (aliases mapping to same IRI are allowed)
  var keyMatches = verbsBlock.match(/^\s+(\w+)\s*:\s*'([^']+)'/gm);
  if (keyMatches) {
    var pairs = keyMatches.map(function(line) {
      var m = line.match(/^\s+(\w+)\s*:\s*'([^']+)'/);
      return { key: m[1], iri: m[2] };
    });
    var seenKeys = {};
    var seenIRIs = {};
    var dupeKeys = [];
    var aliasKeys = [];
    pairs.forEach(function(p) {
      if (seenKeys[p.key]) {
        dupeKeys.push(p.key);
      }
      seenKeys[p.key] = true;
      // Track IRIs to detect aliases (different key, same IRI = intentional alias, OK)
      if (seenIRIs[p.iri] && seenIRIs[p.iri] !== p.key) {
        aliasKeys.push(seenIRIs[p.iri] + '→' + p.key);
      }
      seenIRIs[p.iri] = p.key;
    });
    check('No duplicate verb keys', dupeKeys.length === 0, 'duplicates: ' + dupeKeys.join(', '));
    if (aliasKeys.length > 0) {
      console.log('  \x1b[36mℹ\x1b[0m Aliases (same IRI): ' + aliasKeys.join(', '));
    }
  }
}

// ── 4. Public API ──
console.log('\n\x1b[1m4. Public API\x1b[0m');
check('window.xapiTrack exported', source.indexOf('window.xapiTrack') > -1);
check('window.onLearnerNameSet exported', source.indexOf('window.onLearnerNameSet') > -1);
check('verbUrl helper present', source.indexOf('function verbUrl') > -1);
check('queueOrSend present', source.indexOf('function queueOrSend') > -1);
check('sendStatement present', source.indexOf('function sendStatement') > -1);

// ── 5. onReady structure ──
console.log('\n\x1b[1m5. onReady Callback Structure\x1b[0m');
var onReadyIdx = source.indexOf('onReady(function()');
check('onReady found', onReadyIdx > -1);
if (onReadyIdx > -1) {
  // Check that observer and beforeunload are inside onReady
  var afterOnReady = source.substring(onReadyIdx);
  var observerIdx = afterOnReady.indexOf('new MutationObserver');
  var beforeunloadIdx = afterOnReady.indexOf("addEventListener('beforeunload'");
  check('MutationObserver inside onReady', observerIdx > -1);
  check('beforeunload inside onReady', beforeunloadIdx > -1);
}

// ── 6. No orphaned/stray code ──
console.log('\n\x1b[1m6. Code Hygiene\x1b[0m');
var lines = source.split('\n');
var strayIfErr = lines.filter(function(l) { return l.trim() === "if (err) console.warn('xAPI: failed to send attempted statement', err);"; });
check('No stray duplicate if(err) lines', strayIfErr.length <= 1, strayIfErr.length + ' found');

// Check for direct sendStatement with hardcoded IRIs (should use xapiTrack)
var rawSendCount = (source.match(/sendStatement\('http:\/\/adlnet/g) || []).length;
check('No hardcoded sendStatement IRIs', rawSendCount === 0, rawSendCount + ' found (should use xapiTrack)');

// ── Summary ──
console.log('\n\x1b[1m══════════════════════\x1b[0m');
console.log('\x1b[32mPassed: ' + passes + '\x1b[0m  \x1b[31mFailed: ' + failures + '\x1b[0m');
if (failures === 0) {
  console.log('\x1b[32m\x1b[1mAll checks passed — wrapper is ready!\x1b[0m\n');
  process.exit(0);
} else {
  console.log('\x1b[31m\x1b[1m' + failures + ' check(s) failed — review above.\x1b[0m\n');
  process.exit(1);
}
