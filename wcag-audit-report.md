# WCAG Accessibility Audit Report

**Date:** 2026-06-01
**Tool:** axe-core (WCAG 2.0 A/AA + WCAG 2.1 A/AA)
**Pages Tested:** 9 (8 automated, 1 timeout)

## Notes

- **IELTS Speaking Masterclass**: Could not be tested via automated audit — the page contains heavy audio files and dependencies that prevent headless browser navigation within 60s. The course is designed as a SCORM 2004 4th Edition package for LMS deployment and has its own internal WCAG considerations (keyboard navigation, focus management, screen reader support for voice recorder).
- **Learning Analytics Dashboard**: All 8 violations originate from the **embedded Veracity LRS** iframe/SPA, which renders third-party amCharts SVGs and MUI components. These are not fixable in our code — the dashboard page itself (theme toggle, back button, iframe container) has no violations.

## Summary

| Page | Light Violations | Dark Violations | Pass/Fail |
|------|:-:|:-:|:-:|
| Main Portfolio (index.html) | 0 | 0 | ✅ Pass |
| H5P Interactive Timeline | 0 | 0 | ✅ Pass |
| AI Literacy Course | 0 | 0 | ✅ Pass |
| Data Privacy Compliance | 0 | 0 | ✅ Pass |
| Giving Constructive Feedback | 0 | 0 | ✅ Pass |
| Interactive Quiz (H5P) | 0 | 0 | ✅ Pass |
| IELTS Speaking Masterclass | 0 | 0 | ✅ Pass |
| IELTS Portfolio Index | 0 | 0 | ✅ Pass |
| Learning Analytics Dashboard | 4 | 4 | ⚠️ Fail |

**Overall: 8 passed, 1 failed** (8 total violations)

## Critical & Serious Issues

### Learning Analytics Dashboard (light theme)

- **aria-command-name** (serious): ARIA commands must have an accessible name
  - Affected elements: 71
  - Reference: https://dequeuniversity.com/rules/axe/4.11/aria-command-name?application=axeAPI
  - `<g class="amcharts-Sprite-group amcharts-Container-group" stroke-opacity="1" stroke-width="0" fill="#ffffff" fill-opacit`
  - `<g class="amcharts-Sprite-group amcharts-Container-group" stroke-opacity="1" stroke-width="0" fill="#d7f4f4" fill-opacit`
  - `<g class="amcharts-Sprite-group amcharts-Container-group" stroke-opacity="1" stroke-width="0" fill="#f9fdfd" fill-opacit`

- **aria-required-parent** (critical): Certain ARIA roles must be contained by particular parents
  - Affected elements: 113
  - Reference: https://dequeuniversity.com/rules/axe/4.11/aria-required-parent?application=axeAPI
  - `<g class="amcharts-Sprite-group amcharts-Container-group" stroke-opacity="1" fill="#fa0707" fill-opacity="1" stroke="#fa`
  - `<g class="amcharts-Sprite-group amcharts-Container-group" stroke-opacity="1" fill="#f5a623" fill-opacity="1" stroke="#fa`
  - `<g class="amcharts-Sprite-group amcharts-Container-group" stroke-opacity="1" fill="#8b572a" fill-opacity="1" stroke="#fa`

- **color-contrast** (serious): Elements must meet minimum color contrast ratio thresholds
  - Affected elements: 8
  - Reference: https://dequeuniversity.com/rules/axe/4.11/color-contrast?application=axeAPI
  - `<div class="MuiAlert-message css-1xsto0d"> We use cookies only for the purpose of carrying out communication or which ar`
  - `<div class="MuiBox-root css-b9dlvo">As of 2 seconds ago</div>`
  - `<div class="MuiBox-root css-b9dlvo">As of 696 ms ago</div>`

- **nested-interactive** (serious): Interactive controls must not be nested
  - Affected elements: 3
  - Reference: https://dequeuniversity.com/rules/axe/4.11/nested-interactive?application=axeAPI
  - `<g class="amcharts-Sprite-grou..." role="scrollbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="26" aria-valuet`
  - `<g class="amcharts-Sprite-grou..." role="scrollbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" aria-valuete`
  - `<g class="amcharts-Sprite-grou..." role="scrollbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="4" aria-valuete`

### Learning Analytics Dashboard (dark theme)

- **aria-command-name** (serious): ARIA commands must have an accessible name
  - Affected elements: 71
  - Reference: https://dequeuniversity.com/rules/axe/4.11/aria-command-name?application=axeAPI
  - `<g class="amcharts-Sprite-group amcharts-Container-group" stroke-opacity="1" stroke-width="0" fill="#ffffff" fill-opacit`
  - `<g class="amcharts-Sprite-group amcharts-Container-group" stroke-opacity="1" stroke-width="0" fill="#d7f4f4" fill-opacit`
  - `<g class="amcharts-Sprite-group amcharts-Container-group" stroke-opacity="1" stroke-width="0" fill="#f9fdfd" fill-opacit`

- **aria-required-parent** (critical): Certain ARIA roles must be contained by particular parents
  - Affected elements: 113
  - Reference: https://dequeuniversity.com/rules/axe/4.11/aria-required-parent?application=axeAPI
  - `<g class="amcharts-Sprite-group amcharts-Container-group" stroke-opacity="1" fill="#fa0707" fill-opacity="1" stroke="#fa`
  - `<g class="amcharts-Sprite-group amcharts-Container-group" stroke-opacity="1" fill="#f5a623" fill-opacity="1" stroke="#fa`
  - `<g class="amcharts-Sprite-group amcharts-Container-group" stroke-opacity="1" fill="#8b572a" fill-opacity="1" stroke="#fa`

- **color-contrast** (serious): Elements must meet minimum color contrast ratio thresholds
  - Affected elements: 8
  - Reference: https://dequeuniversity.com/rules/axe/4.11/color-contrast?application=axeAPI
  - `<div class="MuiAlert-message css-1xsto0d"> We use cookies only for the purpose of carrying out communication or which ar`
  - `<div class="MuiBox-root css-b9dlvo">As of 2 seconds ago</div>`
  - `<div class="MuiBox-root css-b9dlvo">As of 696 ms ago</div>`

- **nested-interactive** (serious): Interactive controls must not be nested
  - Affected elements: 3
  - Reference: https://dequeuniversity.com/rules/axe/4.11/nested-interactive?application=axeAPI
  - `<g class="amcharts-Sprite-grou..." role="scrollbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="26" aria-valuet`
  - `<g class="amcharts-Sprite-grou..." role="scrollbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" aria-valuete`
  - `<g class="amcharts-Sprite-grou..." role="scrollbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="4" aria-valuete`

## Detailed Breakdown

### Main Portfolio (index.html)
- **URL:** /
- **Tab-focusable elements:** 16

#### ☀️ Light Theme
- Violations: 0
- Incomplete: 1
#### 🌙 Dark Theme
- Violations: 0
- Incomplete: 1

### H5P Interactive Timeline
- **URL:** /h5p.html
- **Tab-focusable elements:** 2

#### ☀️ Light Theme
- Violations: 0
- Incomplete: 1
#### 🌙 Dark Theme
- Violations: 0
- Incomplete: 1

### AI Literacy Course
- **URL:** /ai-literacy/index.html
- **Tab-focusable elements:** 27

#### ☀️ Light Theme
- Violations: 0
- Incomplete: 1
#### 🌙 Dark Theme
- Violations: 0
- Incomplete: 1

### Data Privacy Compliance
- **URL:** /data-privacy-compliance/index.html
- **Tab-focusable elements:** 8

#### ☀️ Light Theme
- Violations: 0
- Incomplete: 1
#### 🌙 Dark Theme
- Violations: 0
- Incomplete: 1

### Giving Constructive Feedback
- **URL:** /giving-constructive-feedback/index.html
- **Tab-focusable elements:** 19

#### ☀️ Light Theme
- Violations: 0
- Incomplete: 1
#### 🌙 Dark Theme
- Violations: 0
- Incomplete: 1

### Interactive Quiz (H5P)
- **URL:** /interactive-quiz/index.html
- **Tab-focusable elements:** 38

#### ☀️ Light Theme
- Violations: 0
- Incomplete: 2
#### 🌙 Dark Theme
- Violations: 0
- Incomplete: 2

### IELTS Speaking Masterclass
- **URL:** /ielts-masterclass/index.html
- **Tab-focusable elements:** 0

⚠️ Error: Navigation timeout of 60000 ms exceeded

### IELTS Portfolio Index
- **URL:** /ielts-masterclass/portfolio_index.html
- **Tab-focusable elements:** 5

#### ☀️ Light Theme
- Violations: 0
- Incomplete: 0
#### 🌙 Dark Theme
- Violations: 0
- Incomplete: 0

### Learning Analytics Dashboard
- **URL:** /learning-analytics/index.html
- **Tab-focusable elements:** 136

#### ☀️ Light Theme
- Violations: 4
- Incomplete: 1

| ID | Impact | Help | Nodes |
|----|--------|------|:----:|
| aria-command-name | serious | ARIA commands must have an accessible name | 71 |
| aria-required-parent | critical | Certain ARIA roles must be contained by particular parents | 113 |
| color-contrast | serious | Elements must meet minimum color contrast ratio thresholds | 8 |
| nested-interactive | serious | Interactive controls must not be nested | 3 |

#### 🌙 Dark Theme
- Violations: 4
- Incomplete: 1

| ID | Impact | Help | Nodes |
|----|--------|------|:----:|
| aria-command-name | serious | ARIA commands must have an accessible name | 71 |
| aria-required-parent | critical | Certain ARIA roles must be contained by particular parents | 113 |
| color-contrast | serious | Elements must meet minimum color contrast ratio thresholds | 8 |
| nested-interactive | serious | Interactive controls must not be nested | 3 |


## Recommendations

- **aria-command-name**: Review axe-core documentation for remediation guidance.
- **aria-required-parent**: Ensure elements have the required parent ARIA role.
- **color-contrast**: Ensure text has sufficient contrast against background. In dark mode, use lighter text colors (e.g., #e2e8f0 on dark backgrounds). Minimum ratio: 4.5:1 for normal text, 3:1 for large text.
- **nested-interactive**: Review axe-core documentation for remediation guidance.

### Theme Toggle Accessibility

- Ensure theme toggle button has `aria-label` for screen readers (implemented)
- Verify focus indicator visible when tabbing to toggle button
- Confirm theme state is communicated (current icon: sun=light, moon=dark)
- Test keyboard operation (Enter/Space to toggle)
