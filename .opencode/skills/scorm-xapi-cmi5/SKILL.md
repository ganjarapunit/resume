---
name: scorm-xapi-cmi5
description: >-
  Generates SCORM 2004 4th Edition, xAPI, and cmi5 learning packages. Use ONLY when the user asks
  to create, expand, or generate SCORM, xAPI, or cmi5 course packages for portfolio expansion.
  Contains templates, API wrappers, manifest generators, and standards documentation.
---

# SCORM / xAPI / cmi5 Packaging Skill

This skill provides everything needed to generate production-ready SCORM 2004 4th Edition, xAPI, and cmi5 packages. Templates are in the `templates/` subdirectory of this skill.

## Standards overview

### SCORM 2004 4th Edition
- **API object**: `API_1484_11` on the parent window
- **Key methods**: `Initialize("")`, `SetValue("cmi.*", val)`, `Commit("")`, `GetValue("cmi.*")`, `Finish("")`
- **Required values for completion**: `cmi.completion_status = "completed"`, `cmi.success_status = "passed"|"failed"|"unknown"`
- **Manifest**: `imsmanifest.xml` using `IMSCP v1.1` + `ADLCP v1.3` namespaces

### xAPI (Experience API / Tin Can)
- **Endpoint**: LRS endpoint URL
- **Statement format**: `{ "actor": {...}, "verb": {...}, "object": {...}, "result": {...}, "context": {...} }`
- **Auth**: Basic auth (Base64-encoded key:secret) or OAuth 2.0
- **Can run standalone** (no LMS wrapper) or embedded in SCORM

### cmi5
- **Profile**: AU (Assignable Unit) concept
- **Launch**: LMS provides launch parameters via URL query string
- **State management**: Uses xAPI state API for session management
- **Required**: `cmi5.xml` manifest, AU launch HTML, xAPI statements for moveOn, mastery, etc.
- **Key verbs**: `launched`, `initialized`, `completed`, `passed`, `failed`, `terminated`, `waived`

## Using templates

Each template in `templates/` has placeholders in `{{DOUBLE_MUSTACHE}}` syntax. Replace them with project-specific values.

### SCORM 2004 package creation

1. Copy `templates/scorm/imsmanifest.xml` and fill in `{{PLACEHOLDERS}}`
2. Copy `templates/scorm/scorm_wrapper.js`
3. Build your HTML content referencing the API wrapper
4. Create `package_course.py` from `templates/scorm/package_course.py`
5. Run the Python script to generate the `.zip`

### xAPI standalone package creation

1. Copy `templates/xapi/xapi-wrapper.js`
2. Configure the LRS endpoint and auth in your HTML
3. Build interactive content that fires xAPI statements on key events

### cmi5 package creation

1. Copy `templates/cmi5/cmi5.xml` and fill placeholders
2. Copy `templates/cmi5/cmi5-launch.js` for AU launch handling
3. Copy `templates/scorm/scorm_wrapper.js` (also works for cmi5 SCORM fallback)
4. Build AU content and package

## Portfolio conventions (always follow)

- **Font**: `'Outfit', sans-serif` from Google Fonts
- **Icons**: Lucide (`https://unpkg.com/lucide@latest`)
- **Colors**: `--primary: #20457c`, `--primary-light: #3b6fb3`, `--primary-dark: #162f56`, `--accent: #10b981`, `--text: #0f172a`, `--text-muted: #64748b`, `--text-light: #94a3b8`, `--bg: #f1f5f9`
- **UI**: Glassmorphism cards, subtle shadows, backdrop-filter blur, rounded corners (12–24px)
- **Responsive**: Mobile breakpoints at 1024px, 768px, 640px, 400px
- **SCORM**: 2004 4th Edition via `API_1484_11`
- **Audio TTS**: Microsoft Edge TTS via `edge_tts` Python lib, voice `en-US-AvaMultilingualNeural`, rate `+3%`, pitch `+2Hz`
- **Packaging**: Python `zipfile` with `ZIP_DEFLATED`
- **xAPI**: Statements follow `actor` (agent) → `verb` (identified by IRI) → `object` (activity with IRI) structure
